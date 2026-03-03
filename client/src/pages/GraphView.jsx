import React, { useEffect, useRef, useState, useCallback } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { getGraphData } from '../services/api'

function GraphView() {
  const navigate = useNavigate()
  const fgRef = useRef()
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [dimensions, setDimensions] = useState({ w: window.innerWidth, h: window.innerHeight })
  const [filterFolder, setFilterFolder] = useState(null)
  const [folders, setFolders] = useState([])

  useEffect(() => {
    const handleResize = () => setDimensions({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    getGraphData()
      .then(data => {
        setGraphData(data)
        // Extract unique folders from nodes
        const fMap = {}
        data.nodes.forEach(n => {
          if (n.folder) fMap[n.folder.id] = n.folder
        })
        setFolders(Object.values(fMap))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Filter graph data by folder
  const displayData = React.useMemo(() => {
    if (!filterFolder) return graphData
    const nodeIds = new Set(
      graphData.nodes.filter(n => n.folder?.id === filterFolder).map(n => n.id)
    )
    return {
      nodes: graphData.nodes.filter(n => nodeIds.has(n.id)),
      links: graphData.links.filter(l => nodeIds.has(l.source?.id ?? l.source) && nodeIds.has(l.target?.id ?? l.target))
    }
  }, [graphData, filterFolder])

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const isHovered = hoveredNode?.id === node.id
    const isSelected = selectedNode?.id === node.id
    const radius = isSelected ? 9 : isHovered ? 7 : 5

    // Outer glow for hovered/selected
    if (isHovered || isSelected) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius + 4, 0, 2 * Math.PI)
      ctx.fillStyle = isSelected ? 'rgba(124,58,237,0.25)' : 'rgba(139,92,246,0.18)'
      ctx.fill()
    }

    // Node dot
    ctx.beginPath()
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
    if (node.folder) {
      ctx.fillStyle = node.folder.color || '#7c3aed'
    } else {
      ctx.fillStyle = isSelected ? '#a78bfa' : isHovered ? '#c4b5fd' : '#6b7280'
    }
    ctx.fill()

    // White ring for selected
    if (isSelected) {
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius + 2, 0, 2 * Math.PI)
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Label
    const label = node.label.length > 22 ? node.label.slice(0, 22) + '…' : node.label
    const fontSize = Math.max(10 / globalScale, 8)
    ctx.font = `${fontSize}px Inter, sans-serif`
    ctx.fillStyle = isHovered || isSelected ? '#ffffff' : '#888888'
    ctx.textAlign = 'center'
    ctx.fillText(label, node.x, node.y + radius + fontSize + 1)
  }, [hoveredNode, selectedNode])

  const linkCanvasObject = useCallback((link, ctx) => {
    const start = link.source
    const end = link.target
    if (!start.x || !end.x) return

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = link.reason === 'folder' ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)'
    ctx.lineWidth = link.reason === 'folder' ? 1.5 : 0.8
    ctx.stroke()
  }, [])

  const openNote = (noteId) => {
    navigate(`/history?note=${noteId}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#1f1f1f] z-20 relative bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-[#888] hover:text-white text-sm transition-colors"
          >
            ← Back
          </button>
          <div className="w-px h-4 bg-[#222]" />
          <span className="text-white font-semibold text-sm">Graph View</span>
          <span className="text-[#444] text-xs">
            {graphData.nodes.length} notes · {graphData.links.length} connections
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Folder filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterFolder(null)}
              className={`px-3 py-1 text-xs border transition-colors ${!filterFolder
                ? 'border-[#7c3aed] text-[#a78bfa] bg-[#7c3aed]/10'
                : 'border-[#222] text-[#666] hover:border-[#333] hover:text-[#999]'
              }`}
            >
              All
            </button>
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setFilterFolder(filterFolder === f.id ? null : f.id)}
                className={`px-3 py-1 text-xs border transition-colors ${filterFolder === f.id
                  ? 'border-[#7c3aed] text-[#a78bfa] bg-[#7c3aed]/10'
                  : 'border-[#222] text-[#666] hover:border-[#333] hover:text-[#999]'
                }`}
                style={{ borderColor: filterFolder === f.id ? f.color : undefined }}
              >
                {f.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/history')}
            className="px-3 py-1.5 text-xs border border-[#222] text-[#888] hover:border-[#7c3aed] hover:text-[#a78bfa] transition-colors"
          >
            List View
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 bg-[#0f0f0f] border border-[#1f1f1f] px-4 py-3">
        <p className="text-[#555] text-[10px] uppercase tracking-widest mb-1">Legend</p>
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <div className="w-8 h-px bg-[#7c3aed]" />
          Same folder
        </div>
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <div className="w-8 h-px bg-[#ffffff22]" />
          Same exam type
        </div>
        {folders.map(f => (
          <div key={f.id} className="flex items-center gap-2 text-xs text-[#888]">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: f.color }} />
            {f.name}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <div className="w-3 h-3 rounded-full bg-[#6b7280]" />
          Unfoldered
        </div>
      </div>

      {/* Selected node info panel */}
      {selectedNode && (
        <div className="absolute right-6 top-20 z-20 bg-[#0f0f0f] border border-[#222] p-4 w-64">
          <div className="flex items-start justify-between mb-3">
            <div
              className="w-2 h-2 mt-1 flex-shrink-0"
              style={{ backgroundColor: selectedNode.folder?.color || '#6b7280' }}
            />
            <p className="text-white text-sm font-medium leading-snug ml-2 flex-1">{selectedNode.label}</p>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[#555] hover:text-white ml-2 text-xs"
            >✕</button>
          </div>
          {selectedNode.folder && (
            <p className="text-[#888] text-xs mb-1">
              Folder: <span className="text-[#a78bfa]">{selectedNode.folder.name}</span>
            </p>
          )}
          <p className="text-[#888] text-xs mb-3">
            Exam: <span className="text-[#ccc]">{selectedNode.examType}</span>
          </p>
          <button
            onClick={() => openNote(selectedNode.id)}
            className="w-full py-2 text-xs text-white border border-[#7c3aed] hover:bg-[#7c3aed]/20 transition-colors"
          >
            Open Note →
          </button>
        </div>
      )}

      {/* Graph */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border border-[#7c3aed] border-t-transparent animate-spin" />
              <p className="text-[#555] text-sm">Building graph…</p>
            </div>
          </div>
        ) : graphData.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-px bg-[#222] mx-auto mb-4" />
              <p className="text-[#555] text-sm">No notes yet. Generate some notes to see the graph.</p>
              <button
                onClick={() => navigate('/notes')}
                className="mt-4 px-4 py-2 text-xs border border-[#7c3aed] text-[#a78bfa] hover:bg-[#7c3aed]/10 transition-colors"
              >
                Generate Notes
              </button>
            </div>
          </div>
        ) : (
          <ForceGraph2D
            ref={fgRef}
            graphData={displayData}
            width={dimensions.w}
            height={dimensions.h - 53}
            backgroundColor="#0a0a0a"
            nodeCanvasObject={nodeCanvasObject}
            nodeCanvasObjectMode={() => 'replace'}
            linkCanvasObject={linkCanvasObject}
            linkCanvasObjectMode={() => 'replace'}
            onNodeHover={node => setHoveredNode(node)}
            onNodeClick={node => setSelectedNode(selectedNode?.id === node?.id ? null : node)}
            nodePointerAreaPaint={(node, color, ctx) => {
              ctx.beginPath()
              ctx.arc(node.x, node.y, 12, 0, 2 * Math.PI)
              ctx.fillStyle = color
              ctx.fill()
            }}
            cooldownTicks={200}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        )}
      </div>
    </div>
  )
}

export default GraphView
