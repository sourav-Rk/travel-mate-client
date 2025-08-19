import { Outlet } from "react-router-dom";
import { GuideSidebar } from "../guide/GuideSidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

function GuideLayout(){
    const {firstName,lastName} = useSelector((state : RootState) => state.guide.guide);
    let name = firstName[0].toUpperCase() + firstName.slice(1) + " " + lastName[0];
    let initials : string = (firstName[0] + lastName[0]).toUpperCase();
    const guide = {name ,initials}
    return(
        <div>
            <div className="min-h-screen bg-background">
                <GuideSidebar guide={guide}/>
                <Outlet/>
            </div>
        </div>
    )
}

export default GuideLayout