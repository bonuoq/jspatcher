import * as React from "react";
import { Modal, Button } from "semantic-ui-react";
import I18n from "../../i18n/I18n";

interface P {
    lang: string;
    open: boolean;
    onClose: () => any;
    onConfirm: () => any;
}

export default class DeleteAllModal extends React.PureComponent<P> {
    get strings() {
        return I18n[this.props.lang].DeleteAllModal;
    }
    render() {
        return (
            <Modal className="modal-delete-all" basic size="mini" open={this.props.open} onClose={this.props.onClose} closeIcon>
                <Modal.Header>{this.strings.title}</Modal.Header>
                <Modal.Content>{this.strings.msg}</Modal.Content>
                <Modal.Actions>
                    <Button inverted color="grey" size="mini" onClick={this.props.onClose}>{this.strings.cancel}</Button>
                    <Button inverted color="red" size="mini" onClick={this.props.onConfirm}>{this.strings.delete}</Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
