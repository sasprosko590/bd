/**
 * @name Myplugin
 * @author Sasprosko
 * @authorId 597438433807302656
 * @version 0.0.2
 * @description İzinsiz kullanilmaz.
 * @website https://discordapp.com/users/597438433807302656
 * @invite PJUQWXv32u
*/
const request = require("request");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const config = {
    info: {
        name: "Myplugin",
        authors: [
            {
                name: "Sasprosko",
                discord_id: "597438433807302656",
            },
        ],
        version: "0.0.2",
        description:
            "Not: Sectiklerinize Dikkat edin.",
    },
    changelog: [
        {
            title: "What's new",
            type: "added",
            items: ["Added Option to change Discords Splash to the Guild Banner"],
        },
        {
            title: "Small Bugfix",
            type: "fixed",
            items: ["Fixed wrong order"],
        }
    ],
    defaultConfig: [
        {
            type: "switch",
            id: "DiscordRefresh",
            name: "Discordu Yenile",
            value: false,
        }
    ]
};

module.exports = !global.ZeresPluginLibrary
    ? class {
        constructor() {
            this._config = config;
        }
        load() {
            BdApi.showConfirmationModal(
                "Library Missing",
                `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
                {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get(
                            "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                            async (error, response, body) => {
                                if (error)
                                    return require("electron").shell.openExternal(
                                        "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                                    );
                                await new Promise((r) =>
                                    require("fs").writeFile(
                                        require("path").join(
                                            BdApi.Plugins.folder,
                                            "0PluginLibrary.plugin.js"
                                        ),
                                        body,
                                        r
                                    )
                                );
                            }
                        );
                    },
                }
            );
        }
        start() {
            this.load();
        }
        stop() {

        }
    }
    : (([Plugin, Library]) => {
        const { Patcher, DiscordModules, PluginUtilities } = Library;
        const { React } = DiscordModules;
        const Invite = BdApi.findModule(m => m.default?.displayName === "GuildInvite");
        const TooltipContainer = BdApi.findModuleByProps('TooltipContainer').TooltipContainer;
        class Myplugin extends Plugin {
            constructor() {
                super();
                this.getSettingsPanel = () => {
                    return this.buildSettingsPanel().getElement();
                };
            }
            onStart() {
                BDFDB.PatchUtils.forceAllUpdates(this);
                this.Discord();
                PluginUtilities.addStyle(this.getName(), ".content-1r-J1r { flex-wrap: wrap; }");
            }

            onStop() {
                BDFDB.PatchUtils.forceAllUpdates(this);
                Patcher.unpatchAll();
                PluginUtilities.removeStyle(this.getName());
            }

            onSettingsClosed() {
                if (this.SettingsUpdated) {
                    delete this.SettingsUpdated;
                    BDFDB.PatchUtils.forceAllUpdates(this);
                }
            }

            forceUpdateAll() {
                BDFDB.PatchUtils.forceAllUpdates(this);
            }

            async Discord(e) {
                if (this.settings.DiscordRefresh) {
                    BdApi.showConfirmationModal("Discord Yenileme", "Discord Yenilensin mi?", {
                        onConfirm: _ => {
                            location.reload();
                        }
                    })
                    await e.props.children.push(this.settings.DiscordRefresh);
                }
            }
        }
        return Myplugin;
    })(global.ZeresPluginLibrary.buildPlugin(config));
