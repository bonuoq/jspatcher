import BaseObject from "../base/BaseObject";
import type { IArgsMeta, IInletsMeta, IPropsMeta, TMetaType } from "../base/AbstractObject";

interface P {
    description: string;
    type: Exclude<TMetaType, "signal" | "enum">;
}

export default class Out extends BaseObject<{}, {}, [], [any], [number], P> {
    static isPatcherOutlet = "data" as const;
    static description = "Patcher outlet (data)";
    static args: IArgsMeta = [{
        type: "number",
        optional: false,
        default: 1,
        description: "Inlet index (1-based)"
    }];
    static props: IPropsMeta<P> = {
        description: {
            type: "string",
            default: "",
            description: "Description text"
        },
        type: {
            type: "enum",
            enums: ["string", "number", "boolean", "object", "function", "anything", "bang", "color"],
            default: "anything",
            description: "Inlet data type"
        }
    };
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: ""
    }];
    protected get index() {
        return Math.max(1, ~~this.box.args[0] || 1);
    }
    protected _ = { index: this.index };
    protected emitPatcherChangeIO = () => this.patcher.changeIO();
    subscribe() {
        super.subscribe();
        this.on("metaUpdated", this.emitPatcherChangeIO);
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 0;
        });
        this.on("postInit", this.emitPatcherChangeIO);
        this.on("updateArgs", () => {
            const { index } = this;
            if (index !== this._.index) {
                this._.index = index;
                this.patcher.changeIO();
            }
        });
        this.on("updateProps", (props) => {
            const inlet0 = { ...this.meta.inlets[0] };
            if (typeof props.description === "string") inlet0.description = props.description;
            if (typeof props.type === "string") inlet0.type = props.type || "anything";
            this.setMeta({ inlets: [inlet0] });
            this.emitPatcherChangeIO();
        });
        this.on("inlet", ({ data, inlet }) => {
            if (inlet === 0) this.patcher.outlet(this.index - 1, data);
        });
        this.on("destroy", this.emitPatcherChangeIO);
    }
}
