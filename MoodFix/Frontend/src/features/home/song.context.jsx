import { Children, createContext } from "react";
import { useState } from "react";

export const songContext = createContext();

export const SongProvider = ({children})=>{
    const [song, setSong] = useState(
        {
            "title": "Rehmat (From \"Ishq Vishk Rebound\") [DownloadMing.WS]",
            "songUrl": "https://ik.imagekit.io/fxbumjqvn/moodfix/songs/Rehmat__From__Ishq_Vishk_Rebound____DownloadMing.WS_mp3_X8LPyA52_",
            "posterUrl": "https://ik.imagekit.io/fxbumjqvn/moodfix/posters/Rehmat__From__Ishq_Vishk_Rebound____DownloadMing.WS_jpg_9MMT616IO",
            "mood": "surprised",
            "__v": 0
        }
    );

    const [loading, setLoading] = useState(false);

    return(
        <songContext.Provider value={{loading,setLoading,song,setSong}}>
            {children}
        </songContext.Provider>
    )
}