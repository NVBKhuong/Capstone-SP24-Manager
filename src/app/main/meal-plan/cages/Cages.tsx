import FusePageSimple from "@fuse/core/FusePageSimple";
import CagesHeader from "./CagesHeader";
import CagesContent from "./CagesContent";

export default function Cages() {
    return (
        <FusePageSimple
            header={
                <CagesHeader />
            }
            content={
                <CagesContent />
            }
        />


    )
}