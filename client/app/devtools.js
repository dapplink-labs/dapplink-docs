import { setupDevToolsPlugin } from '@vue/devtools-api';
const COMPONENT_STATE_TYPE = 'DappLink';
export const setupDevtools = (app, router, data) => {
    setupDevToolsPlugin({
        // fix recursive dapplink
        app: app,
        id: 'org.vuejs.dapplink-docs',
        label: 'DappLink',
        packageName: 'dapplink-docs',
        homepage: 'https://vitepress.dev',
        componentStateTypes: [COMPONENT_STATE_TYPE]
    }, (api) => {
        // TODO: remove any
        api.on.inspectComponent((payload) => {
            payload.instanceData.state.push({
                type: COMPONENT_STATE_TYPE,
                key: 'route',
                value: router.route,
                editable: false
            });
            payload.instanceData.state.push({
                type: COMPONENT_STATE_TYPE,
                key: 'data',
                value: data,
                editable: false
            });
        });
    });
};
