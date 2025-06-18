import "./show.css"
export default function({title,gallery}){
    
    return (
        <div className="h-[80vw]  w-full sm:max-w-[85vw] md:max-w-[92vw] lg:max-w-[95vw] 3xl:max-w-[60vw] mx-auto pt-10">
            <h1 className="text-3xl showHead">{title}</h1>
            <div className="gallery">
                <div>
                    <img src={gallery && (gallery["Living Room"] ? gallery["Living Room"][0] : gallery["Bedroom 1"][0])} alt="" className="h-[40rem] rounded-l-4xl" />
                </div>
                <div className="grid">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}