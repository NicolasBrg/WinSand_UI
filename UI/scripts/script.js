const DEFAULT_FILE_NAME = "CustomSandboxConfig.wsb";

const windowsPathRegex = /^[A-Z]:\\[^<>:"/\\|?*]+\\[^<>:"/\\|?*]+$/;
const regexWindowsFolder = /^[a-zA-Z]:\/((\w|-|\.)*\/)*(\w|-|\.)*\/$/;
const regexWindowsFile = /^[a-zA-Z]:\/((\w|-|\.)*\/)*(\w|-|\.)*\.\w{1,4}$/i;
const windowsFileNameRegex = /^\w*\.\w{1,4}$/

const DEFAULT_LANGUAGE = "en";
const AVAILABLE_LANGUAGE = {
    fr: {
        name: "Français",
        viewBox: "0 0 0.9 0.9",
        path: [
            { fill: "#ED2939", d: "M.9.675a.1.1 0 0 1-.1.1H.6v-.65h.2a.1.1 0 0 1 .1.1v.45z" },
            { fill: "#002495", d: "M.1.125a.1.1 0 0 0-.1.1v.45a.1.1 0 0 0 .1.1h.2v-.65H.1z" },
            { fill: "#EEE", d: "M.3.125h.3v.65H.3z" }
        ]
    },
    en: {
        name: "English",
        viewBox: "0 0 0.9 0.9",
        path: [
            { fill: "#00247D", d: "M0 .226v.099h.141zm.117.549h.208V.629zM.575.629v.146h.208zM0 .575v.099L.141.575zm.783-.45H.575v.146zM.9.674V.575H.759zm0-.349V.226L.759.325zm-.575-.2H.117l.208.146z" },
            { fill: "#CF1B2B", d: "m.629.575.243.17A.099.099 0 0 0 .897.701L.716.575H.629zm-.304 0H.271l-.243.17a.1.1 0 0 0 .048.027L.325.599V.575zm.25-.25h.054l.243-.17A.1.1 0 0 0 .824.128L.575.301v.024zm-.304 0L.029.155a.1.1 0 0 0-.025.044l.18.126h.087z" },
            { fill: "#EEE", d: "M.9.525H.525v.25h.05V.629l.208.146H.8a.1.1 0 0 0 .071-.03L.629.575h.087l.18.126A.109.109 0 0 0 .9.675V.674L.759.575H.9v-.05zm-.9 0v.05h.141L0 .674v.001a.1.1 0 0 0 .029.07l.243-.17h.053v.024L.077.773A.085.085 0 0 0 .1.776h.017L.325.629v.146h.05v-.25H0zm.9-.3a.1.1 0 0 0-.029-.07l-.242.17H.575V.301L.823.127A.1.1 0 0 0 .8.125H.783L.575.271V.125h-.05v.25H.9v-.05H.759L.9.226V.225zm-.575-.1v.146L.117.125H.1a.1.1 0 0 0-.071.03l.243.17H.184L.004.199A.099.099 0 0 0 0 .225v.001l.141.099H0v.05h.375v-.25h-.05z" },
            { fill: "#CF1B2B", d: "M.525.375v-.25h-.15v.25H0v.15h.375v.25h.15v-.25H.9v-.15z" }
        ]
    },
    es: {
        name: "Español",
        viewBox: "0 0 0.9 0.9",
        path: [
            { fill: "#C60A1D", d: "M.9.675a.1.1 0 0 1-.1.1H.1a.1.1 0 0 1-.1-.1v-.45a.1.1 0 0 1 .1-.1h.7a.1.1 0 0 1 .1.1v.45z" },
            { fill: "#FFC400", d: "M0 .3h.9v.3H0z" },
            { fill: "#EA596E", d: "M.225.425V.5a.075.075 0 1 0 .15 0V.425h-.15z" },
            { fill: "#F4A2B2", d: "M.3.4h.075v.075H.3z" },
            { fill: "#DD2E44", d: "M.225.4H.3v.075H.225z" },
            { fill: "#EA596E", d: "M.375.363A.075.038 0 0 1 .3.4.075.038 0 0 1 .225.363a.075.038 0 0 1 .15 0z" },
            { fill: "#FFAC33", d: "M.375.344A.075.019 0 0 1 .3.363.075.019 0 0 1 .225.344a.075.019 0 0 1 .15 0z" },
            { fill: "#99AAB5", d: "M.175.4H.2v.175H.175zM.4.4h.025v.175H.4z" },
            { fill: "#66757F", d: "M.15.55h.075v.025H.15zm.225 0H.45v.025H.375zm-.2-.175H.2V.4H.175zm.225 0h.025V.4H.4z" }
        ]
    }
}

let ROOT_PATH = "C:/GameSecurity/WinSand_UI";

try {
    ROOT_PATH = new URL(window.location).searchParams.get("root").replaceAll("\\", "/").slice(0, 256); // Get root parameter if exist, only keep 256 first characters
    if(ROOT_PATH.endsWith("/")) ROOT_PATH = ROOT_PATH.slice(0, -1);
    console.log(`Detected root path is : ${ROOT_PATH}`);
} catch(ignored) {}

function createSVG(svgData, width = 20, height = 20) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("viewBox", svgData.viewBox);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    svgData.path.forEach(function (pathItem) {
        var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("fill", pathItem.fill);
        pathElement.setAttribute("d", pathItem.d);
        svg.appendChild(pathElement);
    });

    return svg;
}

async function sendText(val = "ping") {
    return await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: val !== undefined ? val : "ping"
    })
    .then(response => response.text())
    .then(data => {
        try {
            let jsonData = JSON.parse(data);
            console.log(jsonData);
            return jsonData;
        } catch (rawDataWarn) {
            console.log('Réponse du serveur :', data);
            return { raw: data };
        }
    })
    .catch(error => {
        console.error(LANG_DATA.REQUEST_ERROR, error);
        return { error: `${LANG_DATA.REQUEST_ERROR} ${error}` };
    });
}

function createStartCommand(propertyName, description = "", displayName, advanced, value) {
    let label = document.createElement("label");
    label.textContent = displayName;
    label.title = description;
    label.classList.add("twoLines")

    if (advanced) label.classList.add("advanced");

    let startCommand = document.createElement("input");
    startCommand.value = value;
    startCommand.classList.add(propertyName);

    label.appendChild(startCommand);

    return label;
}

function createComponent(propertyName, values, description = "", displayName = propertyName, advanced, defaultValue) {
    let label = document.createElement("label");
    label.textContent = displayName;
    label.title = description;

    if (!advanced) label.classList.add("advanced");

    let select = document.createElement("select");
    select.name = propertyName;
    select.classList.add("CONFIGURATION_ELEMENT");

    for (let key in values) {
        let option = document.createElement("option");
        option.value = key;
        option.textContent = values[key];
        select.appendChild(option);
    }

    select.value = defaultValue ? "Enable" : "Disable";

    label.appendChild(select);

    return label;
}

function createCheckBoxComponent(name, event) {
    let label = document.createElement("label");
    label.textContent = name;

    let input = document.createElement("input");
    input.type = "checkbox";

    input.addEventListener("input", function () {
        event(input);
    });

    event(input);

    label.appendChild(input);

    return label;
}

function createSliderComponent(propertyName, description = "", displayName = propertyName, advanced) {
    let label = document.createElement("label");
    label.textContent = displayName;
    label.title = description;

    if (!advanced) label.classList.add("advanced");

    let p = document.createElement("p");
    p.className = "slider_component";

    let input = document.createElement("input");
    input.type = "range";
    input.name = propertyName;
    input.min = 1024;
    input.max = 16384;
    input.step = 128;
    input.value = 2048;
    input.classList.add("CONFIGURATION_ELEMENT");

    let preview = document.createElement("span");

    function updatePreview() {
        preview.textContent = `${input.value} Mb`;
    }

    input.addEventListener("input", updatePreview);

    updatePreview();

    p.appendChild(input);
    p.appendChild(preview);

    label.appendChild(p);

    return label;
}

function createFileMounting() {
    let DEFAULT_OPTIONS = [
        { host: `${ROOT_PATH}/Shared`, sandbox: "C:/Shared", readOnly: true },
        { host: `${ROOT_PATH}/Desktop`, sandbox: "C:/Users/WDAGUtilityAccount/Desktop/Data", readOnly: true }
    ];

    let content = document.createElement("div");

    let header = document.createElement("div");
    let add = document.createElement("span");

    let file_list = document.createElement("div");
    file_list.classList.add("file_list");

    add.textContent = "+";
    add.classList.add("span_button");

    function createField(classValue, placeholder, defaultValue = "", updateEvent = () => { }) {
        let container = document.createElement("div");
        container.classList.add("pathElement");

        let contentInput = document.createElement("input");

        let eventControler = document.createElement("div");
        let browseFile = document.createElement("img");
        let browseFolder = document.createElement("img");

        contentInput.placeholder = placeholder;
        contentInput.value = defaultValue;
        browseFile.src = "./images/File.svg";
        browseFile.title = window.location.protocol !== "file:" ? LANG_DATA.TITLE_BROWSE_FILE : LANG_DATA.FEATURE_AVAILABLE_WITH_SERVER_ONLY;
        browseFolder.src = "./images/Folder.svg";
        browseFolder.title = window.location.protocol !== "file:" ? LANG_DATA.TITLE_BROWSE_FOLDER : LANG_DATA.FEATURE_AVAILABLE_WITH_SERVER_ONLY;

        if(window.location.protocol === "file:") {
            browseFile.classList.add("offline");
            browseFolder.classList.add("offline");
        }

        contentInput.classList.add("contentInput", classValue);
        browseFolder.classList.add("cursor");
        browseFile.classList.add("cursor");
        eventControler.classList.add("eventControler");
        browseFile.classList.add("switch", "on");

        browseFile.addEventListener("click", async (ev) => {
            if(window.location.protocol === "file:") return;

            ev.stopPropagation();
            if (container.parentElement.classList.contains("automatic")) return;

            let result = await sendText("browse");
            if (result !== undefined && result.path !== undefined) {
                contentInput.value = result.path;
            }

            updateEvent();
        });

        browseFolder.addEventListener("click", async (ev) => {
            if(window.location.protocol === "file:") return;
            ev.stopPropagation();
            if (container.parentElement.classList.contains("automatic")) return;

            let result = await sendText("browseFolder");
            if (result !== undefined && result.path !== undefined) {
                contentInput.value = result.path;
            }

            updateEvent();
        });

        eventControler.appendChild(browseFile);
        eventControler.appendChild(browseFolder);

        container.appendChild(contentInput);
        container.appendChild(eventControler);

        return { container, contentInput };
    }

    function updateElement(PATH_ELEMENT) {
        PATH_ELEMENT.contentInput.classList.toggle("folder", regexWindowsFolder.test(PATH_ELEMENT.contentInput.value) || regexWindowsFolder.test(`${PATH_ELEMENT.contentInput.value}/`));
        PATH_ELEMENT.contentInput.classList.toggle("file", regexWindowsFile.test(PATH_ELEMENT.contentInput.value));
    }

    function createOption(defaultEnabled = true, defaultReadOnly = true, defaultRealPath = "", defaultVirtualPath = "", automatic = false) {

        function updateVirtual() {
            virtualPath.contentInput.placeholder = realPath.contentInput.value;
            updateElement(realPath);
        }

        function updateVirtualData() {
            updateElement(virtualPath);
        }

        let optionDiv = document.createElement("div");
        optionDiv.classList.add("line_option");
        if (automatic) optionDiv.classList.add("automatic");

        let lineEnable = document.createElement("input");
        lineEnable.type = "checkbox";
        lineEnable.checked = defaultEnabled;
        lineEnable.disabled = automatic;
        lineEnable.classList.add("lineEnable");

        let realPath = createField("REAL_PATH", LANG_DATA.PLACEHOLDER_REAL_PATH, defaultRealPath, () => { updateVirtual(); updateVirtualData(); });
        let virtualPath = createField("VIRTUAL_PATH", "", defaultVirtualPath, () => { updateVirtual(); updateVirtualData(); });

        realPath.contentInput.disabled = automatic;
        virtualPath.contentInput.disabled = automatic;

        let remove = document.createElement("img");
        remove.src = `./images/${automatic ? "Lock" : "Remove"}.svg`;
        remove.title = automatic ? LANG_DATA.TITLE_UNLOCK : LANG_DATA.TITLE_REMOVE;
        remove.classList.add("removeButton", "cursor");

        let readOnly = document.createElement("span");
        readOnly.type = "text";
        readOnly.classList.add("slider", defaultReadOnly ? "on" : "off");

        readOnly.addEventListener("click", (ev) => {
            ev.stopPropagation();
            if (automatic) return;
            let currentToggle = readOnly.classList.contains("on");

            readOnly.classList.toggle("on", !currentToggle);
            readOnly.classList.toggle("off", currentToggle);
        });

        updateVirtual();
        updateVirtualData();

        realPath.contentInput.addEventListener("input", updateVirtual);
        realPath.contentInput.addEventListener("change", updateVirtual);

        virtualPath.contentInput.addEventListener("input", updateVirtualData);
        virtualPath.contentInput.addEventListener("change", updateVirtualData);

        optionDiv.appendChild(lineEnable);
        optionDiv.appendChild(readOnly);
        optionDiv.appendChild(realPath.container);
        optionDiv.appendChild(virtualPath.container);
        optionDiv.appendChild(remove);

        optionDiv.addEventListener("click", function (e) {
            if (automatic) return;
            if (e.target.nodeName === "INPUT") return;

            lineEnable.checked = !lineEnable.checked;
        });

        remove.addEventListener("click", function (ev) {
            if (automatic) {
                ev.stopPropagation();
                automatic = false;
                remove.src = `./images/Remove.svg`;
                optionDiv.classList.remove("automatic");
                lineEnable.disabled = false;
                realPath.contentInput.disabled = false;
                virtualPath.contentInput.disabled = false;
                remove.title = LANG_DATA.TITLE_REMOVE;
            } else {
                optionDiv.remove();
            }
        });

        return optionDiv;
    }

    function createHeaderElement(text = "", className, title = text) {
        let headerElement = document.createElement("div");

        headerElement.classList.add(className);
        headerElement.textContent = text;
        headerElement.title = title;

        return headerElement;
    }

    // Création du header
    let headerLegend = document.createElement("div");
    headerLegend.classList.add("lineHeader");

    let header_enabled = createHeaderElement(LANG_DATA.HEADER_ENABLED, "header_enabled", LANG_DATA.TITLE_HEADER_ENABLED);
    let header_readOnly = createHeaderElement(LANG_DATA.HEADER_READ_ONLY, "header_readOnly", LANG_DATA.TITLE_HEADER_READ_ONLY);
    let header_realPath = createHeaderElement(LANG_DATA.HEADER_REAL_PATH, "header_realPath", LANG_DATA.TITLE_HEADER_REAL_PATH);
    let header_virtualPath = createHeaderElement(LANG_DATA.HEADER_VIRTUAL_PATH, "header_virtualPath", LANG_DATA.TITLE_HEADER_VIRTUAL_PATH);
    let header_remove = createHeaderElement(LANG_DATA.HEADER_REMOVE, "header_remove", LANG_DATA.TITLE_HEADER_REMOVE);

    headerLegend.appendChild(header_enabled);
    headerLegend.appendChild(header_readOnly);
    headerLegend.appendChild(header_realPath);
    headerLegend.appendChild(header_virtualPath);
    headerLegend.appendChild(header_remove);

    file_list.appendChild(headerLegend);

    for (let defaultOption of DEFAULT_OPTIONS) {
        file_list.appendChild(createOption(true, defaultOption.readOnly, defaultOption.host, defaultOption.sandbox, true));
    }

    add.addEventListener("click", function () {
        file_list.appendChild(createOption());
    })

    header.classList.add("header");
    header.textContent = LANG_DATA.SECTION_MAPPING;
    header.appendChild(add);

    content.appendChild(header);

    content.appendChild(file_list);

    return content;
}

function downloadFile(contenu, nomFichier) {
    const blob = new Blob([contenu], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = nomFichier;
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function buildSaveButton() {
    let save = document.createElement("input");
    save.type = "button";

    save.value = LANG_DATA.BUTTON_SAVE;
    save.classList.add("validate_button");

    function format_date(number) {
        return (number > 9 ? "" : "0") + number;
    }

    save.addEventListener("click", function () {
        let FILE_NAME = DEFAULT_FILE_NAME;

        let query_h2 = document.querySelector("h2");
        if (query_h2 !== undefined && windowsFileNameRegex.test(query_h2.textContent)) {
            FILE_NAME = query_h2.textContent;
        }

        let current_date = new Date();
        let result = `<?xml version="1.0"?>\n<Configuration Name="${FILE_NAME}" CreatedAt="${format_date(current_date.getUTCDate())}/${format_date(current_date.getUTCMonth() + 1)}/${format_date(current_date.getUTCFullYear())}">`;

        let CONFIGURATION_ELEMENTS = document.querySelectorAll(".CONFIGURATION_ELEMENT");

        for (let CONFIGURATION_ELEMENT of CONFIGURATION_ELEMENTS) {
            result += `\n\t<${CONFIGURATION_ELEMENT.name}>${CONFIGURATION_ELEMENT.value}</${CONFIGURATION_ELEMENT.name}>`;
        }

        let paths = [];

        let line_options = document.querySelectorAll(".file_list .line_option");
        let ignored = 0;
        let error = 0;

        for (let line_option of line_options) {
            let checkbox = line_option.querySelector("input[type='checkbox']");
            let realPath = line_option.querySelector(".pathElement .REAL_PATH");
            let virtualPath = line_option.querySelector(".pathElement .VIRTUAL_PATH");
            let toggleReadOnly = line_option.querySelector(".slider");

            if (checkbox === undefined || checkbox === null) { show_message("ERROR", LANG_DATA.CHECK_ERROR_HTML_ENABLED); continue; }
            if (checkbox.checkbox == false) { show_message("WARNING", LANG_DATA.CHECK_WARNING_NOT_CHECKED); ignored++; continue; }
            if (toggleReadOnly === undefined || toggleReadOnly === null) { show_message("ERROR", LANG_DATA.CHECK_ERROR_HTML_READ_ONLY); continue; }
            if (realPath === undefined || realPath === null) { show_message("ERROR", LANG_DATA.CHECK_ERROR_HTML_REAL_PATH); continue; }
            if (realPath.value.length === 0) { show_message("WARNING", LANG_DATA.CHECK_ERROR_EMPTY_REAL_PATH); ignored++; error++; continue; }
            if (!realPath.classList.contains("folder") && !realPath.classList.contains("file")) { show_message("WARNING", LANG_DATA.CHECK_WARNING_INVALID_REAL_PATH.replace("$PATH", realPath.value)); }
            if (virtualPath === undefined || virtualPath === null) { show_message("ERROR", LANG_DATA.CHECK_ERROR_HTML_VIRTAL_PATH); ignored++; error++; continue; }
            if (virtualPath.value.length > 0 && !virtualPath.classList.contains("folder") && !virtualPath.classList.contains("file")) { show_message("WARNING", LANG_DATA.CHECK_WARNING_INVALID_VIRTUAL_PATH.replace("$PATH", virtualPath.value)); }

            if (virtualPath.value.length > 0 && !((realPath.classList.contains("folder") && virtualPath.classList.contains("folder")) || (realPath.classList.contains("file") && virtualPath.classList.contains("file")))) { show_message("WARNING", LANG_DATA.CHECK_WARNING_MISMATCH_TYPE); }

            paths.push({ host: realPath.value, sandbox: virtualPath.value.length > 0 ? virtualPath.value : realPath.value, readOnly: toggleReadOnly.classList.contains("on") });
        }

        if (ignored > 0) {
            show_message(
                "INFO",
                LANG_DATA.CHECK_INFO_IGNORED
                    .replace("$IGNORED", ignored)
                    .replace("$MORE_THAN_ONE", ignored > 1 ? "s" : "")
                    .replace("$IF_ERROR",
                        (error > 0 ?
                            LANG_DATA.CHECK_INFO_IGNORED_IF_ERROR
                                .replace("$ERROR", error)
                                .replace("$MORE_THAN_ONE", error > 1 ? "s" : "")
                            :
                            ""
                        )
                    )
            );
        }

        if (paths.length > 0) {
            result += `\n\t<MappedFolders>`;

            for (let path of paths) {
                result += `\n\t\t<MappedFolder>\n\t\t\t<HostFolder>${path.host.replaceAll("/","\\")}</HostFolder>\n\t\t\t<SandboxFolder>${path.sandbox.replaceAll("/","\\")}</SandboxFolder>\n\t\t\t<ReadOnly>${path.readOnly}</ReadOnly>\n\t\t</MappedFolder>`;
            }

            result += `\n\t</MappedFolders>`;
        } else {
            result += `\n\t<MappedFolders/>`;
        }

        let startCommand = document.querySelector(".StartCommand");
        if(startCommand !== null && startCommand.value.length > 0) {
            result += `\n\t<LogonCommand>\n\t\t<Command>${startCommand.value}</Command>\n\t</LogonCommand>`;
        }

        result += `\n</Configuration>`;

        downloadFile(result, FILE_NAME);

        console.log(result);
        show_message("SUCCESS", LANG_DATA.CHECK_SUCCESS);
    });

    return save;
}

function show_message(level, message, time = 10, load_image = true) {
    let messageBox = document.createElement("div");
    messageBox.classList.add("alert", `alert-${level}`);

    let container = document.createElement("div");
    container.classList.add("alertContent");
    let progress = document.createElement("div");
    progress.classList.add("progress");

    let icon = document.createElement("img");
    icon.classList.add("icon");
    let content = document.createElement("span");
    let close = document.createElement("img");
    if (load_image) close.src = "./images/Remove.svg";
    close.classList.add("RemoveAlert", "cursor");

    if (load_image) {
        switch (level) {
            case "WARNING":
                icon.src = "./images/Warning.svg";
                break;
            case "SUCCESS":
                icon.src = "./images/Valid.svg";
                break;
            case "INFO":
                icon.src = "./images/Info.svg";
                break;
            case "ERROR":
                icon.src = "./images/Error.svg";
                break;
        }
    }

    content.textContent = message;

    container.appendChild(icon);
    container.appendChild(content);
    container.appendChild(close);

    messageBox.appendChild(container);
    messageBox.appendChild(progress);

    ALERT_CONTAINER.appendChild(messageBox);
    let DONE = false;

    function END() {
        if (DONE) return;

        DONE = true;
        messageBox.style.transitionDuration = "0.3s";
        messageBox.style.opacity = "0";
        messageBox.classList.remove("appear");

        setTimeout(() => {
            messageBox.classList.add("alertDeletion");
            setTimeout(() => {
                messageBox.remove();
            }, 300);
        }, 300);
    }

    close.addEventListener("click", END);

    let TIMEOUT = setTimeout(END, time * 1000);

    function ENTER_EVENT() {
        if (DONE) return;

        clearTimeout(TIMEOUT);
        progress.style.transitionDuration = "0s";
        progress.style.width = "0%";
    }

    function LEAVE_EVENT() {
        if (DONE) return;

        progress.style.transitionDuration = "10s";
        progress.style.width = "100%";

        TIMEOUT = setTimeout(END, time * 1000);
    }

    messageBox.addEventListener("mouseenter", ENTER_EVENT);
    messageBox.addEventListener("mouseleave", LEAVE_EVENT);

    setTimeout(() => {
        messageBox.classList.add("appear");

        setTimeout(() => {
            messageBox.classList.add("show");

            setTimeout(() => {
                progress.style.transitionDuration = "10s";
                progress.style.width = "100%";
            }, 100);
        }, 300);
    }, 100);

    console.log(level, message);
}

function createTitle() {
    let title = document.createElement('h2');

    title.textContent = DEFAULT_FILE_NAME;
    title.contentEditable = "true";
    
    title.addEventListener("blur", function () {
        if (!windowsFileNameRegex.test(title.textContent)) {
            show_message("WARNING", LANG_DATA.CHECK_WARNING_FILE_NAME.replace("$NAME", title.textContent));
            title.textContent = DEFAULT_FILE_NAME;
        }
    });

    return title;
}

function buildStopButton() {
    let stop_server = document.createElement("input");

    stop_server.type = "button";
    stop_server.value = LANG_DATA.BUTTON_STOP
    stop_server.classList.add("stop_button");
    
    stop_server.addEventListener("click", async () => {
        let result = await sendText("close");
        if (result.raw === "closed") {
            show_message("INFO", LANG_DATA.SERVER_CLOSE_SUCCESS, 10, false);
        } else {
            show_message("WARNING", LANG_DATA.SERVER_CLOSE_WARNING, 10, false);
        }
    });

    return stop_server;
}

function setLangCookie(lang) {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    document.cookie = `lang=${encodeURIComponent(lang)}; expires=${expirationDate.toUTCString()}; path=/`;
}

function getLangFromCookie() {
    const cookieArray = document.cookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i].trim();

        if (cookie.startsWith('lang=')) {
            const langValue = decodeURIComponent(cookie.substring(5));
            if (AVAILABLE_LANGUAGE[langValue] === undefined) return DEFAULT_LANGUAGE;

            return langValue || DEFAULT_LANGUAGE;
        }
    }

    // Aucun cookie de langue trouvé, retourne la valeur par défaut
    return DEFAULT_LANGUAGE;
}

function BuildPage() {
    // Création du formulaire
    let form = document.createElement("form");
    form.id = "sandboxConfigForm";
    form.appendChild(createTitle());

    form.appendChild(createCheckBoxComponent(LANG_DATA.SECTION_ADVANCED, function (input_reference) {
        let advanced = document.querySelectorAll(".advanced");
        for (let advanced_fied of advanced) {
            advanced_fied.style.cssText = (!input_reference.checked ? "" : "display: flex!important");
        }
    }));

    form.appendChild(document.createElement("br"));

    form.appendChild(createComponent("VGpu", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_VGPU, LANG_DATA.SECTION_DISPLAY_NAME_VGPU, true, false));
    form.appendChild(createComponent("Networking", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_NETWORKING, LANG_DATA.SECTION_DISPLAY_NAME_NETWORKING, true, true));
    form.appendChild(createComponent("AudioInput", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_AUDIO, LANG_DATA.SECTION_DISPLAY_NAME_AUDIO, false, false));
    form.appendChild(createComponent("VideoInput", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_VIDEO, LANG_DATA.SECTION_DISPLAY_NAME_VIDEO, false, false));
    form.appendChild(createComponent("ProtectedClient", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_PROTECTED, LANG_DATA.SECTION_DISPLAY_NAME_PROTECTED, true, true));
    form.appendChild(createComponent("PrinterRedirection", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_PRINTER, LANG_DATA.SECTION_DISPLAY_NAME_PRINTER, false, false));
    form.appendChild(createComponent("ClipboardRedirection", { "Enable": LANG_DATA.OPTION_ENABLED, "Disable": LANG_DATA.OPTION_DISABLED }, LANG_DATA.SECTION_DESCRIPTION_CLIPBOARD, LANG_DATA.SECTION_DISPLAY_NAME_CLIPBOARD, true, false));
    form.appendChild(createStartCommand("StartCommand", LANG_DATA.SECTION_DESCRIPTION_START_COMMAND, LANG_DATA.SECTION_DISPLAY_NAME_START_COMMAND, true, `powershell -executionpolicy unrestricted -command "start powershell {-noexit -file C:/Shared/Setup.ps1}"`));
    form.appendChild(createSliderComponent("MemoryInMB", LANG_DATA.SECTION_DESCRIPTION_MEMORY, LANG_DATA.SECTION_DISPLAY_NAME_MEMORY, true));

    form.appendChild(createFileMounting());
    form.appendChild(buildSaveButton());
    if(window.location.protocol !== "file:") form.appendChild(buildStopButton());

    document.body.appendChild(form);

    // Création du menu de langue
    let LANG_CONTAINER = document.createElement("div");
    LANG_CONTAINER.id = "LANG_CONTAINER";

    let current_flag = createSVG(AVAILABLE_LANGUAGE[CURRENT_LANGUAGE]);
    current_flag.classList.add("CURRENT_FLAG");

    let availableLanguage = document.createElement("div");
    availableLanguage.classList.add("availableLanguage");

    for (let langKey in AVAILABLE_LANGUAGE) {
        let flagContainer = document.createElement("div");
        let flag = createSVG(AVAILABLE_LANGUAGE[langKey]);

        flagContainer.title = AVAILABLE_LANGUAGE[langKey].name;
        flagContainer.appendChild(flag);

        flagContainer.addEventListener("click", () => {
            setLangCookie(langKey);
            window.location = window.location;
        });

        availableLanguage.appendChild(flagContainer);
    }

    LANG_CONTAINER.appendChild(current_flag);
    if(window.location.protocol !== "file:") {
        LANG_CONTAINER.appendChild(availableLanguage);
    } else {
        LANG_CONTAINER.title = LANG_DATA.FEATURE_AVAILABLE_WITH_SERVER_ONLY;
    }

    document.body.appendChild(LANG_CONTAINER);

    let FOOTER = document.createElement("footer");
    FOOTER.textContent = "WinSand*UI - User Interface for Windows Sandbox configuration creation - Nicolas BERANGER - Version 1.1 - 14/01/2024";
    document.body.appendChild(FOOTER);
}

async function fetchLangData(LANG) {
    try {
        const response = await fetch(`/languages/${LANG}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(LANG_DATA.REQUEST_LANG_ERROR);
        return undefined;
    }
}

// Création du conteneur des alertes
const ALERT_CONTAINER = document.createElement("div");
ALERT_CONTAINER.id = "ALERT_CONTAINER";
document.body.appendChild(ALERT_CONTAINER);

let NEXT_LANG = getLangFromCookie();
let CURRENT_LANGUAGE = DEFAULT_LANGUAGE;
// Copie interne du fichier de langue en français pour permettre le fonctionnement normal en cas d'utilisation du fichier en local.
let LANG_DATA = {
    "REQUEST_ERROR": "Error sending the request:",
    "REQUEST_RESULT": "Server response:",
    "REQUEST_LANG_ERROR": "Unable to load the language. Check that the language exists and that the server is running correctly.",

    "FEATURE_AVAILABLE_WITH_SERVER_ONLY": "This feature is only accessible if you use the page provided by the server.",

    "TITLE_BROWSE_FILE": "Browse files...",
    "TITLE_BROWSE_FOLDER": "Browse folders...",
    "TITLE_UNLOCK": "Click to unlock.",
    "TITLE_REMOVE": "Click to remove.",

    "SECTION_ADVANCED": "Use advanced mode",
    "SECTION_MAPPING": "Folder mapping:",

    "SECTION_DESCRIPTION_VGPU": "Uses GPU virtualization. If the option is active, performance will be better, but the attack surface increases.",
    "SECTION_DESCRIPTION_NETWORKING": "",
    "SECTION_DESCRIPTION_AUDIO": "",
    "SECTION_DESCRIPTION_VIDEO": "",
    "SECTION_DESCRIPTION_PROTECTED": "Features like copy/paste will no longer be available.",
    "SECTION_DESCRIPTION_PRINTER": "",
    "SECTION_DESCRIPTION_CLIPBOARD": "",
    "SECTION_DESCRIPTION_MEMORY": "If Windows lacks resources to start, the size may increase.",
    "SECTION_DESCRIPTION_START_COMMAND": "",

    "SECTION_DISPLAY_NAME_VGPU": "GPU Virtualization",
    "SECTION_DISPLAY_NAME_NETWORKING": "Network Activation",
    "SECTION_DISPLAY_NAME_AUDIO": "Permission for audio input access",
    "SECTION_DISPLAY_NAME_VIDEO": "Permission for video input access",
    "SECTION_DISPLAY_NAME_PROTECTED": "Additional security layer",
    "SECTION_DISPLAY_NAME_PRINTER": "Permission for printer access",
    "SECTION_DISPLAY_NAME_CLIPBOARD": "Clipboard sharing between system and test machine",
    "SECTION_DISPLAY_NAME_MEMORY": "Machine memory in megabytes (MB)",
    "SECTION_DISPLAY_NAME_START_COMMAND": "Command to run at startup",

    "OPTION_ENABLED": "Enabled",
    "OPTION_DISABLED": "Disabled",

    "BUTTON_SAVE": "Create Windows Sandbox configuration!",
    "BUTTON_STOP": "Stop the server",

    "SERVER_CLOSE_SUCCESS": "The server has been successfully closed.",
    "SERVER_CLOSE_WARNING": "Unable to reach the server.",

    "HEADER_ENABLED": "#",
    "HEADER_READ_ONLY": "#",
    "HEADER_REAL_PATH": "Path on Host",
    "HEADER_VIRTUAL_PATH": "Path on the Sandbox",
    "HEADER_REMOVE": "#",

    "TITLE_HEADER_ENABLED": "Export item",
    "TITLE_HEADER_READ_ONLY": "Read-only",
    "TITLE_HEADER_REAL_PATH": "Path on Host",
    "TITLE_HEADER_VIRTUAL_PATH": "Path on the Sandbox",
    "TITLE_HEADER_REMOVE": "Remove mount point",

    "PLACEHOLDER_REAL_PATH": "C:/example_path/",

    "CHECK_ERROR_HTML_ENABLED": "Unable to find the HTML element to check mapping activation.",
    "CHECK_ERROR_HTML_READ_ONLY": "Unable to find the HTML element to set permissions on mapping.",
    "CHECK_ERROR_HTML_REAL_PATH": "Unable to find the HTML element containing the real path of mapping.",
    "CHECK_ERROR_HTML_VIRTUAL_PATH": "Unable to find the HTML element containing the virtual path of mapping.",

    "CHECK_ERROR_EMPTY_REAL_PATH": "The real path cannot be empty.",

    "CHECK_WARNING_INVALID_REAL_PATH": "The real path '$PATH' seems to be invalid. This could cause problems.",
    "CHECK_WARNING_INVALID_VIRTUAL_PATH": "The virtual path '$PATH' seems to be invalid. This could cause problems.",
    "CHECK_WARNING_MISMATCH_TYPE": "Real and virtual paths seem to have a different or invalid type. This could cause problems.",

    "CHECK_WARNING_NOT_CHECKED": "A rule has not been selected, so it will be ignored",

    "CHECK_INFO_IGNORED": "Not all paths have been added; $IGNORED were ignored$MORE_THAN_ONE$IF_ERROR",
    "CHECK_INFO_IGNORED_IF_ERROR": " due to $ERROR error$MORE_THAN_ONE.",

    "CHECK_WARNING_FILE_NAME": "The configuration file cannot have the name '$NAME', the default value has been restored.",

    "CHECK_SUCCESS": "The file has been successfully exported."
}

if (NEXT_LANG !== DEFAULT_LANGUAGE) {
    fetchLangData(NEXT_LANG).then(e => {
        if(e !== undefined) {
            CURRENT_LANGUAGE = NEXT_LANG;
            LANG_DATA = e;
        }

        BuildPage();
    })
} else {
    BuildPage();
}