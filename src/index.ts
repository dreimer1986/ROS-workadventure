/// <reference path="../node_modules/@workadventure/iframe-api-typings/iframe_api.d.ts" />

import {bootstrapExtra} from "@workadventure/scripting-api-extra";

// The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure.
bootstrapExtra().catch(e => console.error(e));

let currentPopup: any = undefined;

WA.room.onEnterLayer('clockZone').subscribe(() => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    currentPopup = WA.ui.openPopup("clockPopup","It's " + time,[]);
})

WA.room.onLeaveLayer('clockZone').subscribe(closePopUp)

WA.room.onEnterLayer('RIPZone').subscribe(() => {
    currentPopup = WA.ui.openPopup("RIPPopup","R.I.P.\nGé van Geldorp\n✝ 2011\nStefan Ginsberg\n✝ 2022\nJames Tabor\n✝ 2023\nWe miss you, guys...",[]);
})

WA.room.onLeaveLayer('RIPZone').subscribe(closePopUp)

function closePopUp(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}
