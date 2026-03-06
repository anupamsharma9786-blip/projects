import { getSong } from "../services/song.api";
import { songContext } from "../song.context";
import { useContext } from "react";

export const useSong = ()=>{
    const {loading,setLoading,song,setSong} = useContext(songContext);

    async function handleGetSong(mood){
        setLoading(true);
        const data = await getSong(mood);
        setSong(data.song);
        setLoading(false);
    }

    
    return ({loading,song,handleGetSong})
}

