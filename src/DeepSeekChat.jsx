
import {useEffect, useState} from "react";
import {getQueryParams} from "./main";
import { marked } from 'marked';
import $ from "jquery";
import { codeToHtml } from 'shiki'


marked.use({
    breaks: true
});

export default function DeepSeekChat() {

    const [chatContent, setChatContent] = useState([
        {
            "type": "user",
            "content": getQueryParams(window.location.href).a
        }
    ]);

    function generateRandomString(length) {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

    async function highlightAll() {

        document.querySelectorAll('pre code[class^="language-"]').forEach(block => {
            block.id = generateRandomString(10);
        });

        for (const block of document.querySelectorAll('pre code[class^="language-"]:not([data-highlighted])')) {
            const unicID = block.id;
            const lang = block.className.replace('language-', '');
            const code = block.textContent;
            const highlightedCode = await codeToHtml(code, {theme: 'catpuccin-mocha', lang: lang});

            $.get(`https://raw.githubusercontent.com/shikijs/textmate-grammars-themes/refs/heads/main/packages/tm-grammars/grammars/${lang}.json`, (data) => {

                document.getElementById(unicID).setAttribute("data-highlighted", true);
                document.getElementById(unicID).parentElement.outerHTML = highlightedCode.split(">")[0] + `><div class="shiki-title">${JSON.parse(data).displayName}</div><pre class="shiki-content">` + highlightedCode.replace( highlightedCode.split(">")[0] + ">", "") + "</pre>";
            })
        }
    }

    const [chatDOM, setChatDOM] = useState(<></>);
    const [txtAreaV, setTxtAreaV] = useState("");

    useEffect(() => {
        import("./deepseek.css");
        if(window.lastReadedChat === JSON.parse(JSON.stringify(chatContent))) return;
        window.lastReadedChat = JSON.parse(JSON.stringify(chatContent));
        setChatDOM(<>{

            chatContent.map((message, ind) => {
                const key = ind;
                if(message.type === "user") {
                    return(
                        <div className="message-container message-user" key={key}>
                            <div className="message-bubble">
                                <span>{message.content}</span>
                            </div>
                        </div>
                    );
                } else if (message.type === "assistant") {

                    setTimeout(() => {
                        highlightAll();
                        document.querySelector(".chat-container").scrollTo({top: document.querySelector(".chat-container").scrollHeight})
                    }, 400);

                    function getRedirection(message) {
                        if(!message) return;
                        if(!message.split("{redirect:")) return;
                        return message.split("{redirect:")[1].split("}")[0];
                    }

                    function redirectModal() {
                        const redirection = getRedirection(message.content);
                        window.spClick1 = () => {
                            const btn = document.querySelector(".modal-container .sp1");
                            if(!btn) return;
                            if(btn.classList.contains("ctrlKey")) {
                                window.open(redirection, "_blank");
                            } else {
                                window.location.href = redirection;
                            }
                        }
                        const keycheck = (e) => {
                            console.log("tecleado")
                            if(e.ctrlKey) {
                                if(!document.querySelector(".modal-container .sp1")) return;
                                document.querySelector(".modal-container .sp1").classList.add("ctrlKey");
                                document.querySelector(".modal-container .sp1").classList.remove("NOTctrlKey");
                                console.log("sí")
                            } else {
                                document.querySelector(".modal-container .sp1").classList.remove("ctrlKey");
                                document.querySelector(".modal-container .sp1").classList.add("NOTctrlKey");
                                console.log("no")
                            }
                        }
                        console.log("registrando")
                        window.removeEventListener("keydown", keycheck);
                        window.removeEventListener("keyup", keycheck);
                        setTimeout(() => {
                            window.addEventListener("keydown", keycheck);
                            window.addEventListener("keyup", keycheck);
                        }, 10)
                        return `
                        <div class="modal-container">
                            <div class="modal">
                                <h1>Abrir página web</h1>
                                <div class="modal-content">
                                    <p>DeepSeek ha solicitado abrir una página web.</p>
                                    <a href="${redirection}">${redirection}</a>
                                    <div class="modal-buttons">
                                        <button class="modal-button blue sp1 NOTctrlKey" onclick="window.spClick1()">Abrir<span class="control-text"> en una nueva pestaña</span></button>
                                        <button class="modal-button red" onclick='document.querySelector(".modal-container").remove();'>Cancelar</button>
                                    </div>
                                    <label data-checked="false">
                                        <input checked="false" onchange='document.querySelector(".modal-container label").dataset.checked = this.checked;' type="checkbox" name="remember" value="remember">
                                        <span>
                                            <div class="rotationtext">
                                                <font class="true">No</font>
                                                <font class="false">Siempre</font>
                                            </div> 
                                            <label>preguntar</label>
                                        </span>
                                    </label>
</label>
                                </div>
                            </div>
                        </div>
                        `;
                    }

                    return(
                        <div className="message-container message-assistant" key={key}>
                            <div className="message-logo">
                                <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path id="path" d="M27.501 8.46875C27.249 8.3457 27.1406 8.58008 26.9932 8.69922C26.9434 8.73828 26.9004 8.78906 26.8584 8.83398C26.4902 9.22852 26.0605 9.48633 25.5 9.45508C24.6787 9.41016 23.9785 9.66797 23.3594 10.2969C23.2275 9.52148 22.79 9.05859 22.125 8.76172C21.7764 8.60742 21.4238 8.45312 21.1807 8.11719C21.0098 7.87891 20.9639 7.61328 20.8779 7.35156C20.8242 7.19336 20.7695 7.03125 20.5879 7.00391C20.3906 6.97266 20.3135 7.13867 20.2363 7.27734C19.9258 7.84375 19.8066 8.46875 19.8174 9.10156C19.8447 10.5234 20.4453 11.6562 21.6367 12.4629C21.7725 12.5547 21.8076 12.6484 21.7646 12.7832C21.6836 13.0605 21.5869 13.3301 21.501 13.6074C21.4473 13.7852 21.3662 13.8242 21.1768 13.7461C20.5225 13.4727 19.957 13.0684 19.458 12.5781C18.6104 11.7578 17.8438 10.8516 16.8877 10.1426C16.6631 9.97656 16.4395 9.82227 16.207 9.67578C15.2314 8.72656 16.335 7.94727 16.5898 7.85547C16.8574 7.75977 16.6826 7.42773 15.8193 7.43164C14.957 7.43555 14.167 7.72461 13.1611 8.10938C13.0137 8.16797 12.8594 8.21094 12.7002 8.24414C11.7871 8.07227 10.8389 8.0332 9.84766 8.14453C7.98242 8.35352 6.49219 9.23633 5.39648 10.7441C4.08105 12.5547 3.77148 14.6133 4.15039 16.7617C4.54883 19.0234 5.70215 20.8984 7.47559 22.3633C9.31348 23.8809 11.4307 24.625 13.8457 24.4824C15.3125 24.3984 16.9463 24.2012 18.7881 22.6406C19.2529 22.8711 19.7402 22.9629 20.5498 23.0332C21.1729 23.0918 21.7725 23.002 22.2373 22.9062C22.9648 22.752 22.9141 22.0781 22.6514 21.9531C20.5186 20.959 20.9863 21.3633 20.5605 21.0371C21.6445 19.752 23.2783 18.418 23.917 14.0977C23.9668 13.7539 23.9238 13.5391 23.917 13.2598C23.9131 13.0918 23.9512 13.0254 24.1445 13.0059C24.6787 12.9453 25.1973 12.7988 25.6738 12.5352C27.0557 11.7793 27.6123 10.5391 27.7441 9.05078C27.7637 8.82422 27.7402 8.58789 27.501 8.46875ZM15.46 21.8613C13.3926 20.2344 12.3906 19.6992 11.9766 19.7227C11.5898 19.7441 11.6592 20.1875 11.7441 20.4766C11.833 20.7617 11.9492 20.959 12.1123 21.209C12.2246 21.375 12.3018 21.623 12 21.8066C11.334 22.2207 10.1768 21.668 10.1221 21.6406C8.77539 20.8477 7.64941 19.7988 6.85547 18.3652C6.08984 16.9844 5.64453 15.5039 5.57129 13.9238C5.55176 13.541 5.66406 13.4062 6.04297 13.3379C6.54199 13.2461 7.05762 13.2266 7.55664 13.2988C9.66602 13.6074 11.4619 14.5527 12.9668 16.0469C13.8262 16.9004 14.4766 17.918 15.1465 18.9121C15.8584 19.9688 16.625 20.9746 17.6006 21.7988C17.9443 22.0879 18.2197 22.3086 18.4824 22.4707C17.6895 22.5586 16.3652 22.5781 15.46 21.8613ZM16.4502 15.4805C16.4502 15.3105 16.5859 15.1758 16.7568 15.1758C16.7949 15.1758 16.8301 15.1836 16.8613 15.1953C16.9033 15.2109 16.9424 15.2344 16.9727 15.2695C17.0273 15.3223 17.0586 15.4004 17.0586 15.4805C17.0586 15.6504 16.9229 15.7852 16.7529 15.7852C16.582 15.7852 16.4502 15.6504 16.4502 15.4805ZM19.5273 17.0625C19.3301 17.1426 19.1328 17.2129 18.9434 17.2207C18.6494 17.2344 18.3281 17.1152 18.1533 16.9688C17.8828 16.7422 17.6895 16.6152 17.6074 16.2168C17.5732 16.0469 17.5928 15.7852 17.623 15.6348C17.6934 15.3105 17.6152 15.1035 17.3877 14.9141C17.2012 14.7598 16.9658 14.7188 16.7061 14.7188C16.6094 14.7188 16.5205 14.6758 16.4541 14.6406C16.3457 14.5859 16.2568 14.4512 16.3418 14.2852C16.3691 14.2324 16.501 14.1016 16.5322 14.0781C16.8838 13.877 17.29 13.9434 17.666 14.0938C18.0146 14.2363 18.2773 14.498 18.6562 14.8672C19.0439 15.3145 19.1133 15.4395 19.334 15.7734C19.5078 16.0371 19.667 16.3066 19.7754 16.6152C19.8408 16.8066 19.7559 16.9648 19.5273 17.0625Z" fill-rule="nonzero" fill="#4D6BFE"></path></svg>
                            </div>
                            <div className="message-content">
                                <span dangerouslySetInnerHTML={{__html: message.content ? (
                                    message.content.includes("{redirect:")
                                        ? `<span class='command-msg'>Redirección a <a href='${getRedirection(message.content)}'>${getRedirection(message.content)}</a> rechazada.</span>${redirectModal()}`
                                        : marked.parse(message.content).replaceAll("<code class=", `<code id="${generateRandomString(10)}" class=`)
                                ) : "Undefined message.content."}} />
                            </div>
                        </div>
                    );
                }
            })

        }</>);

        if(chatContent[chatContent.length - 1].type === "user") {
            document.querySelector(".input").classList.add("locked");
            document.querySelector(".input textarea").blur();
            setChatContent([...chatContent, {
                type: "assistant",
                content: "Pensando..."
            }]);
            $.post("https://short.clienturl.net/api/deepseekQuery/query.php", {
                q: chatContent[chatContent.length - 1].content
            }, (data) => {

                function sanitizeThink(msg) {
                    return msg.split("</think>")[msg.split("</think>").length - 1]
                }
                // remove last element
                setChatContent([...chatContent, {
                    type: "assistant",
                    content: sanitizeThink(data)
                }]);
                document.querySelector(".input").classList.remove("locked");
                document.querySelector(".input textarea").focus();
            });
        }
    }, [chatContent]);

    function submit() {
        if(document.querySelector(".input").classList.contains("locked")) return;
        setChatContent([...chatContent, {
            type: "user",
            content: txtAreaV
        }]);
    }

    function keyDown(e) {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit()
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <svg viewBox="-2 0 175 32" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><path id="path" d="M75.32 25.23L72.83 25.23L72.83 21.37L75.32 21.37C76.86 21.37 78.42 20.99 79.43 19.92C80.44 18.85 80.81 17.2 80.81 15.57C80.81 13.94 80.44 12.3 79.43 11.23C78.42 10.16 76.86 9.78 75.32 9.78C73.77 9.78 72.22 10.16 71.21 11.23C70.19 12.3 69.83 13.94 69.83 15.57L69.83 31.44L65.46 31.44L65.46 5.92L69.83 5.92L69.83 7.54L70.63 7.54C70.71 7.45 70.8 7.36 70.9 7.27C71.99 6.27 73.66 5.92 75.32 5.92C77.89 5.92 80.48 6.56 82.17 8.34C83.85 10.12 84.46 12.86 84.46 15.58C84.46 18.29 83.85 21.03 82.17 22.81C80.48 24.6 77.89 25.23 75.32 25.23Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M8.79 6.59L11.28 6.59L11.28 10.45L8.79 10.45C7.25 10.45 5.69 10.83 4.68 11.91C3.67 12.98 3.3 14.62 3.3 16.25C3.3 17.88 3.67 19.52 4.68 20.59C5.69 21.66 7.25 22.05 8.79 22.05C10.34 22.05 11.89 21.66 12.9 20.59C13.92 19.52 14.28 17.88 14.28 16.25L14.28 0.39L18.65 0.39L18.65 25.91L14.28 25.91L14.28 24.28L13.48 24.28C13.4 24.38 13.31 24.47 13.21 24.55C12.12 25.55 10.45 25.91 8.79 25.91C6.22 25.91 3.63 25.27 1.94 23.48C0.26 21.7 -0.35 18.97 -0.35 16.25C-0.35 13.53 0.26 10.8 1.94 9.01C3.63 7.23 6.22 6.59 8.79 6.59Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M40.59 15.91L40.59 17.46L28.95 17.46L28.95 14.36L36.67 14.36C36.49 13.23 36.08 12.18 35.36 11.42C34.3 10.31 32.69 9.91 31.08 9.91C29.48 9.91 27.86 10.31 26.81 11.42C25.76 12.52 25.38 14.22 25.38 15.91C25.38 17.6 25.76 19.3 26.81 20.41C27.86 21.52 29.48 21.91 31.08 21.91C32.69 21.91 34.3 21.52 35.36 20.41C35.5 20.25 35.64 20.08 35.76 19.9L40.08 19.9C39.71 21.24 39.1 22.45 38.2 23.4C36.44 25.25 33.75 25.91 31.08 25.91C28.41 25.91 25.72 25.25 23.97 23.4C22.21 21.55 21.58 18.72 21.58 15.91C21.58 13.1 22.21 10.27 23.97 8.42C25.72 6.58 28.41 5.92 31.08 5.92C33.75 5.92 36.44 6.58 38.2 8.42C39.96 10.27 40.59 13.1 40.59 15.91Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M62.52 15.91L62.52 17.46L50.88 17.46L50.88 14.36L58.61 14.36C58.43 13.23 58.02 12.18 57.29 11.42C56.24 10.31 54.63 9.91 53.02 9.91C51.42 9.91 49.8 10.31 48.75 11.42C47.7 12.52 47.32 14.22 47.32 15.91C47.32 17.6 47.7 19.3 48.75 20.41C49.8 21.52 51.42 21.91 53.02 21.91C54.63 21.91 56.24 21.52 57.29 20.41C57.44 20.25 57.58 20.08 57.7 19.9L62.02 19.9C61.64 21.24 61.04 22.45 60.14 23.4C58.38 25.25 55.69 25.91 53.02 25.91C50.35 25.91 47.66 25.25 45.9 23.4C44.15 21.55 43.52 18.72 43.52 15.91C43.52 13.1 44.15 10.27 45.9 8.42C47.66 6.58 50.35 5.92 53.02 5.92C55.69 5.92 58.38 6.58 60.14 8.42C61.89 10.27 62.52 13.1 62.52 15.91Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M96.9 25.91C99.57 25.91 102.26 25.52 104.01 24.43C105.77 23.34 106.4 21.67 106.4 20.01C106.4 18.35 105.77 16.68 104.01 15.59C102.26 14.5 99.57 14.11 96.9 14.11L96.99 14.11C95.85 14.11 94.7 13.96 93.96 13.53C93.21 13.11 92.94 12.46 92.94 11.82C92.94 11.17 93.21 10.53 93.96 10.1C94.7 9.68 95.85 9.53 96.99 9.53C98.13 9.53 99.28 9.68 100.03 10.1C100.78 10.53 101.04 11.17 101.04 11.82L105.49 11.82C105.49 10.16 104.92 8.49 103.34 7.4C101.75 6.31 99.32 5.92 96.9 5.92C94.48 5.92 92.05 6.31 90.46 7.4C88.87 8.49 88.3 10.16 88.3 11.82C88.3 13.48 88.87 15.15 90.46 16.24C92.05 17.33 94.48 17.72 96.9 17.72C98.16 17.72 99.53 17.87 100.36 18.29C101.19 18.71 101.48 19.36 101.48 20.01C101.48 20.65 101.19 21.3 100.36 21.72C99.53 22.14 98.26 22.3 97 22.3C95.74 22.3 94.47 22.14 93.65 21.72C92.82 21.3 92.52 20.65 92.52 20.01L87.4 20.01C87.4 21.67 88.03 23.34 89.78 24.43C91.54 25.52 94.22 25.91 96.9 25.91Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M128.33 15.91L128.33 17.46L116.69 17.46L116.69 14.36L124.42 14.36C124.24 13.23 123.83 12.18 123.1 11.42C122.05 10.31 120.44 9.91 118.83 9.91C117.23 9.91 115.61 10.31 114.56 11.42C113.51 12.52 113.13 14.22 113.13 15.91C113.13 17.6 113.51 19.3 114.56 20.41C115.61 21.52 117.23 21.91 118.83 21.91C120.44 21.91 122.05 21.52 123.1 20.41C123.25 20.25 123.39 20.08 123.51 19.9L127.83 19.9C127.45 21.24 126.85 22.45 125.95 23.4C124.19 25.25 121.5 25.91 118.83 25.91C116.16 25.91 113.47 25.25 111.71 23.4C109.96 21.55 109.33 18.72 109.33 15.91C109.33 13.1 109.96 10.27 111.71 8.42C113.47 6.58 116.16 5.92 118.83 5.92C121.5 5.92 124.19 6.58 125.95 8.42C127.7 10.27 128.33 13.1 128.33 15.91Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M150.27 15.91L150.27 17.46L138.63 17.46L138.63 14.36L146.36 14.36C146.17 13.23 145.77 12.18 145.04 11.42C143.99 10.31 142.37 9.91 140.77 9.91C139.17 9.91 137.55 10.31 136.5 11.42C135.44 12.52 135.07 14.22 135.07 15.91C135.07 17.6 135.44 19.3 136.5 20.41C137.55 21.52 139.17 21.91 140.77 21.91C142.37 21.91 143.99 21.52 145.04 20.41C145.19 20.25 145.32 20.08 145.45 19.9L149.77 19.9C149.39 21.24 148.79 22.45 147.88 23.4C146.13 25.25 143.44 25.91 140.77 25.91C138.1 25.91 135.4 25.25 133.65 23.4C131.9 21.55 131.27 18.72 131.27 15.91C131.27 13.1 131.9 10.27 133.65 8.42C135.4 6.58 138.1 5.92 140.77 5.92C143.44 5.92 146.13 6.58 147.88 8.42C149.64 10.27 150.27 13.1 150.27 15.91Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><rect id="rect" x="153.211426" y="-0.499512" width="4.371000" height="26.415646" fill="currentColor" fill-opacity="1.000000"></rect><path id="polygon" d="M165.04 15.31L172.21 25.91L166.79 25.91L159.62 15.31L166.79 6.81L172.21 6.81L165.04 15.31Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path></svg>
            </div>
            <div className="chat-content">
                {chatDOM}
                <div className="input">
                    <div className="round-multimedia">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="icon icon-tabler icons-tabler-outline icon-tabler-plus">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 5l0 14"/>
                            <path d="M5 12l14 0"/>
                        </svg>
                    </div>
                    <textarea rows={1} placeholder="Type your message here..." value={txtAreaV} onInput={(e) => setTxtAreaV(e.target.value)} onKeyDown={keyDown} />
                </div>
            </div>
        </div>
    )
}