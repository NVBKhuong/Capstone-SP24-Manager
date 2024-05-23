import FusePageCarded from '@fuse/core/FusePageCarded';
import MenuSampleContent from './MenuSampleContent';
import MenuSampleHeader from './MenuSampleHeader';



function MenuSample() {

    return (<FusePageCarded
        header={<MenuSampleHeader />}
        content={<MenuSampleContent />}

    />)
}

export default MenuSample;
