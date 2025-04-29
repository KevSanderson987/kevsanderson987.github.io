
if (!window.pkb) {
    window.pkb = {};
}

window.pkb.toggleSubmitTypes = function (disabled) {
    const elements = document.querySelectorAll("input[type='submit'], button[type='submit']");
    elements.forEach(element => {
       element.disabled = disabled;
    });
};

window.pkb.disableSubmitTypes = function (form, event) {
    window.pkb.toggleSubmitTypes(true);
    
    const formName = form.getAttribute("name");
    let formAction = form.getAttribute("action");
    const elementName = event !== null ? event.target.name : null;
    const elementValue = event !== null ? event.target.value : null;
    const elementType = event !== null ? event.target.tagName.toLowerCase() : null;
    
    if (formName === null) {
        form.submit();
        return;
    } else if (formAction === null) {
        formAction = formName + ".action";
    }

    if (elementName !== null) {
        if (elementName.indexOf("method:") === 0) {
            formAction = formAction + "?" + elementName
        } else if (elementType === "button") {
            formAction = formAction + "?" + elementName + (elementValue !== null ? "=" + elementValue : "");
        }
    }
    
    form.action = formAction;
    
    if (form.onsubmit == null) {
        HTMLFormElement.prototype.submit.call(form);
    } else {
        const submitEvent = new CustomEvent("submit", {
           bubbles: false,
           cancelable: false,
        });
        const valid = form.dispatchEvent(submitEvent);
        if (valid) {
            HTMLFormElement.prototype.submit.call(form);
        } else {
            window.pkb.toggleSubmitTypes(false);
        }
    }
};

window.pkb.prepareAllFormSubmitsForAutoDisable = function () {
    const forms = document.querySelectorAll("form");
    for (let form of forms) {
        const elements = form.querySelectorAll("input[type='submit'], button[type='submit']");
        elements.forEach(element => {
            if (element.getAttribute("onclick") === null) {
                element.addEventListener("click", (event) => window.pkb.disableSubmitTypes(form, event));
            }
        });
    }
    
    Object.defineProperties(window.pkb, {
        doubleClickPreventionRan: {
            value: true
        }
    });
};

window.addEventListener("load", window.pkb.prepareAllFormSubmitsForAutoDisable);

$(document).on("keydown", ":input:not(textarea):not(:submit)", function(event) {
    if ((event.keyCode ? event.keyCode : event.which) === 13) {
        const defaultActionComponent = document.querySelector("[data-defaultAction='true']");
        if (defaultActionComponent) {
            defaultActionComponent.click();
            return false;
        }
    }
    return true;
});
