import React from 'react';
import cx from 'classnames';
import SubForm from '../Form/SubForm';
import { createObject } from '../../utils/helper';
import { FormItem } from '../Form/Item';
import { ActionProps } from '../Action';
import { DropDownButtonProps } from '../DropDownButton';

export default class MobileSubForm extends SubForm {
  buildButtonSchema(buttons: Array<ActionProps | DropDownButtonProps> = []): Array<any> {
    buttons = buttons || this.props.buttons;

    return buttons.map((button: ActionProps | DropDownButtonProps) => {
      if (button.type === 'dropdown-button') {
        return {
          ...button,
          buttons: this.buildButtonSchema(button.buttons as Array<ActionProps>)
        }
      } else if (button.actionType === 'openSubForm') {
        return {
          ...button,
          actionType: 'custom',
          onClick: this.open.bind(this)
        };
      } else {
        return button;
      }
    });
  }

  buildListSchema() {
    const { list, value } = this.props;

    return {
      type: 'cards',
      source: value,
      card: list
    };
  }

  buildDialogSchema() {
    let schema = super.buildDialogSchema.apply(this, arguments);
    schema.type = 'drawer';
    return schema;
  }

  renderList() {
    const { render } = this.props;
    return render('cards', this.buildButtonSchema());
  }

  renderBtns() {
    const { render, buttons } = this.props;
    return render('action', this.buildButtonSchema(buttons));
  }

  render() {
    const {
      multiple,
      classPrefix: ns,
      className,
      render,
      value,
      data,
      label
    } = this.props;
    const openedIndex = this.state.openedIndex;

    return (
      <div className={cx(`${ns}Drawer-SubFormControl`, className)}>
        <div className={`${ns}Form-item ${ns}Form-item--horizontal`}>
          <div className={`${ns}Form-label ${ns}Form-itemColumn--2`}>{label}</div>
          {this.renderBtns()}
        </div>
        {this.renderList()}
        {render(`dalog /${openedIndex}`, this.buildDialogSchema(), {
          show: openedIndex !== -1,
          onClose: this.close,
          onConfirm: this.handleDialogConfirm,
          data: createObject(
            data,
            (multiple ? Array.isArray(value) && value[openedIndex] : value) ||
            {}
          )
        })}
      </div>
    );
  }
}

@FormItem({
  type: 'mobile-form',
  sizeMutable: false
})
export class MobileSubFormControlRenderer extends MobileSubForm { }