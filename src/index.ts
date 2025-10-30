/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

let RIPPopup;
let clockPopup;

WA.room.onEnterLayer('clockZone').subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    clockPopup = WA.ui.openPopup("popupRectangle","It's " + time,[{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    ]);
    })

WA.room.onLeaveLayer('clockZone').subscribe(() => {
    clockPopup.close();
})

WA.room.onEnterLayer('RIPZone').subscribe(() => {
    RIPPopup = WA.ui.openPopup("popupRectangle","R.I.P.\nGé van Geldorp\n✝ 2011\nStefan Ginsberg\n✝ 2022\nJames Tabor\n✝ 2023\nWe miss you, guys...",[{
        label: "Close",
        className: "primary",
        callback: (popup) => {
            // Close the popup when the "Close" button is pressed.
            popup.close();
        }
    ]);
    })

WA.room.onLeaveLayer('RIPZone').subscribe(() => {
    RIPPopup.close();
})
