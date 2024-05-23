import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import Error404Page from './Error404Page';
import authRoles from '../../auth/authRoles';

const Error404Config: FuseRouteConfigType = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    auth: authRoles.user,
    routes: [
        {
            path: '404',
            element: <Error404Page />
        }
    ]
};

export default Error404Config;
