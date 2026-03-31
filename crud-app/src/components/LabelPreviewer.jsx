import {useState} from "react";
import {ready} from "zpl-renderer-js";

export default function LabelPreviewer({form,setForm}){
    const [myImg, setImg] = useState('')

    const getImg = async ()=> {

        const {api} = await ready;
        const label = await api.zplToBase64Async(form.zplCode,100,100,8);
        setImg(label)
    }

    getImg()

    return (
        <div style={{display: "flex", gap: "2rem", marginLeft:"5rem"}}>
            <textarea
                value={form.zplCode}
                onChange={(e) => setForm({...form, zplCode: e.target.value})}
                cols={100}
                rows={50}
            />
            {
                myImg && <img
                    src={`data:image/png;base64,${myImg}`}
                />
            }
        </div>
    )
}