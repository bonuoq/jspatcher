import * as React from "react";
import { Menu, Icon } from "semantic-ui-react";
import type PatcherEditor from "../../core/patcher/PatcherEditor";
import type Box from "../../core/patcher/Box";
import type BaseUI from "../../core/objects/base/BaseUI";
import type BaseObject from "../../core/objects/base/BaseObject";

export default class UIDock extends React.PureComponent<{ editor: PatcherEditor; display: boolean }, { box: Box }> {
    state = { box: undefined as Box };
    refDiv = React.createRef<HTMLDivElement>();
    refUI = React.createRef<BaseUI>();
    handleDestroy = () => this.setState({ box: undefined });
    handleDock = (boxId: string) => {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        this.setState({ box: undefined });
        const box = this.props.editor.instance.boxes[boxId];
        if (!box) return;
        this.forceUpdate(() => {
            box.object.on("destroy", this.handleDestroy);
            this.setState({ box });
        });
    };
    handleResize = () => {
        if (this.refDiv.current && this.refUI.current) {
            const { width, height } = this.refDiv.current.getBoundingClientRect();
            this.refUI.current.setState({ width, height });
        }
    };
    handleClear = () => {
        if (this.state.box) {
            this.state.box.object.off("destroy", this.handleDestroy);
            this.setState({ box: undefined });
        }
    };
    componentDidMount() {
        this.props.editor.on("dockUI", this.handleDock);
        window.addEventListener("resize", this.handleResize);
    }
    componentWillUnmount() {
        if (this.state.box) this.state.box.object.off("destroy", this.handleDestroy);
        this.props.editor.off("dockUI", this.handleDock);
        window.removeEventListener("resize", this.handleResize);
    }
    render() {
        if (!this.props.display) return <></>;
        const { box } = this.state;
        const ctrlKey = this.props.editor.env.os === "MacOS" ? "Cmd" : "Ctrl";
        return (
            <>
                <div className="dock-ui" ref={this.refDiv}>
                    {box
                        ? <box.UI object={box.object as BaseObject} editor={this.props.editor} editing={false} onEditEnd={() => undefined} inDock ref={this.refUI} />
                        : <div className="dock-ui-default">{ctrlKey} + Enter on selected box to dock UI</div>}
                </div>
                <Menu icon inverted size="mini">
                    <Menu.Item onClick={this.handleClear} title="Clear">
                        <Icon name="delete" inverted />
                    </Menu.Item>
                </Menu>
            </>
        );
    }
}
