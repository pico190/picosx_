import bangs from "./bangs.js";
import {useEffect, useState} from "react";

export default function MainSearch() {

    const [sxBarIcon, setSxBarIcon] = useState(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"
             className="icon icon-tabler icons-tabler-outline icon-tabler-search">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
            <path d="M21 21l-6 -6"/>
        </svg>
    );

    const [bangExtra, setBangExtra] = useState("")

    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        let a = false;
        document.querySelector(".bang-extra").style.left = document.querySelector(".search-bar input").offsetLeft + "px"
        Object.keys(bangs).forEach(bang => {
            if (inputValue.startsWith(bang)) {
                a = true;
                setBangExtra(bang);
                setSxBarIcon(<span style={{display: "flex"}} dangerouslySetInnerHTML={{__html: bangs[bang].icon}} />)
            }
        })
        if(!a) {
            setBangExtra("");
            setSxBarIcon(<span style={{display: "flex"}} dangerouslySetInnerHTML={{__html: bangs["<void>"].icon}} />)
        }
    }, [inputValue]);

    function click(e) {
        const button = document.querySelector(".search-btn");
        const rippleContainer = button.querySelector(".ripple-container");
        const ripple = document.createElement("div");
        ripple.classList.add("ripple");
        const rect = button.getBoundingClientRect();

        ripple.style.top = (e.clientY - (rect.top)) + "px";
        ripple.style.left = (e.clientX - (rect.left)) + "px";
        rippleContainer.appendChild(ripple);
        setTimeout(() => {
            ripple.style.opacity = 0;
            setTimeout(() => {
                rippleContainer.removeChild(ripple);
            }, 1000);
        }, 1000);
    }

    function change(e) {
        setInputValue(e.target.value)
    }

    return (
        <div className="page">
            <div className="full-center">
                <h1>PICOSX</h1>
                <form className="search-bar">
                    {sxBarIcon}
                    <span className="bang-extra">{bangExtra}</span>
                    <input name="q" value={inputValue} type="text" placeholder="Busca aqui jaja" onChange={change} />
                    <button className="search-btn" type="submit" onClick={click}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"
                             className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
                            <path d="M21 21l-6 -6"/>
                        </svg>
                        <div className="ripple-container">

                        </div>
                    </button>
                </form>
            </div>
            <div className="about-section">
                <h1>Bangs<span>!</span></h1>
                <div className="bang-container">
                    {
                        Object.keys(bangs).map(bang => {
                            const bangData = bangs[bang];
                            if(bang === "<void>") return;
                            return <div className="bang-element" key={bang}>
                                <span className="bang">{bang}</span>
                                <span className="bang-mark">
                                    <span className="icon" dangerouslySetInnerHTML={{__html: bangData.icon}} />
                                    <span className="name">{bangData.name}</span>
                                </span>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}