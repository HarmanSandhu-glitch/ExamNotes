import axios from "axios"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser" , {withCredentials:true})
        
        dispatch(setUserData(result.data))
    } catch (error) {
        console.log(error)
    }
}

export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(serverUrl+ "/api/notes/generate-notes" , payload , {withCredentials:true})
        console.log(result.data)
        return result.data

    } catch (error) {
        console.log(error)
    }
}

export const downloadPdf = async (result) => {
    try {
        const response = await axios.post(serverUrl+ "/api/pdf/generate-pdf" , {result} , {
            responseType:"blob" , withCredentials:true
        })

        const blob = new Blob([response.data], {
      type: "application/pdf"
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamNotesAI.pdf";
    link.click();

    window.URL.revokeObjectURL(url);
    } catch (error) {
         throw new Error("PDF download failed");

    }
}

export const deleteNote = async (id) => {
    const result = await axios.delete(serverUrl + `/api/notes/${id}`, { withCredentials: true })
    return result.data
}

export const updateProfile = async (payload) => {
    const result = await axios.put(serverUrl + "/api/user/profile", payload, { withCredentials: true })
    return result.data
}

export const getUserStats = async () => {
    const result = await axios.get(serverUrl + "/api/user/stats", { withCredentials: true })
    return result.data
}

// ─── Folders ──────────────────────────────────────────────────────────────────

export const getFolders = async () => {
    const result = await axios.get(serverUrl + "/api/folder", { withCredentials: true })
    return result.data
}

export const createFolder = async (name, color = "#7c3aed") => {
    const result = await axios.post(serverUrl + "/api/folder", { name, color }, { withCredentials: true })
    return result.data
}

export const updateFolder = async (id, payload) => {
    const result = await axios.put(serverUrl + `/api/folder/${id}`, payload, { withCredentials: true })
    return result.data
}

export const deleteFolder = async (id) => {
    const result = await axios.delete(serverUrl + `/api/folder/${id}`, { withCredentials: true })
    return result.data
}

export const moveNoteToFolder = async (noteId, folderId) => {
    const result = await axios.put(serverUrl + `/api/folder/move/${noteId}`, { folderId }, { withCredentials: true })
    return result.data
}

export const getGraphData = async () => {
    const result = await axios.get(serverUrl + "/api/notes/graph", { withCredentials: true })
    return result.data
}
