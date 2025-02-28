import omit from 'omit.js';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import PropTypes from '../_util/vue-types';
import { getOptionProps, hasProp, getComponentFromProp, mergeProps } from '../_util/props-util';
import BaseMixin from '../_util/BaseMixin';
import buttonTypes from '../button/buttonTypes';
import Icon from '../icon';
import Button from '../button';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale-provider/default';

const tooltipProps = abstractTooltipProps();
const btnProps = buttonTypes();
const Popconfirm = {
  name: 'APopconfirm',
  props: {
    ...tooltipProps,
    prefixCls: PropTypes.string.def('ant-popover'),
    transitionName: PropTypes.string.def('zoom-big'),
    content: PropTypes.any,
    title: PropTypes.any,
    trigger: tooltipProps.trigger.def('click'),
    okType: btnProps.type.def('primary'),
    okText: PropTypes.any,
    cancelText: PropTypes.any,
    icon: PropTypes.any,
    okButtonProps: PropTypes.object,
    cancelButtonProps: PropTypes.object,
  },
  mixins: [BaseMixin],
  model: {
    prop: 'visible',
    event: 'visibleChange',
  },
  watch: {
    visible(val) {
      this.sVisible = val;
    },
  },
  data() {
    const props = getOptionProps(this);
    const state = { sVisible: false };
    if ('visible' in props) {
      state.sVisible = props.visible;
    } else if ('defaultVisible' in props) {
      state.sVisible = props.defaultVisible;
    }
    return state;
  },
  methods: {
    onConfirm(e) {
      this.setVisible(false, e);
      this.$emit('confirm', e);
    },

    onCancel(e) {
      this.setVisible(false, e);
      this.$emit('cancel', e);
    },

    onVisibleChange(sVisible) {
      this.setVisible(sVisible);
    },

    setVisible(sVisible, e) {
      if (!hasProp(this, 'visible')) {
        this.setState({ sVisible });
      }
      this.$emit('visibleChange', sVisible, e);
    },
    getPopupDomNode() {
      return this.$refs.tooltip.getPopupDomNode();
    },
    renderOverlay(popconfirmLocale) {
      const { prefixCls, okType, okButtonProps, cancelButtonProps } = this;
      const icon = getComponentFromProp(this, 'icon') || (
        <Icon type="exclamation-circle" theme="filled" />
      );
      const cancelBtnProps = mergeProps(
        {
          props: {
            size: 'small',
            ...cancelButtonProps,
          },
          on: {
            click: this.onCancel,
          },
        },
      );
      const okBtnProps = mergeProps(
        {
          props: {
            type: okType,
            size: 'small',
            ...okButtonProps,
          },
          on: {
            click: this.onConfirm,
          },
        },
      );
      return (
        <div class={`${prefixCls}-inner-content`}>
          <div class={`${prefixCls}-message`}>
            {icon}
            <div class={`${prefixCls}-message-title`}>{getComponentFromProp(this, 'title')}</div>
          </div>
          <div class={`${prefixCls}-buttons`}>
            <Button {...cancelBtnProps}>
              {getComponentFromProp(this, 'cancelText') || popconfirmLocale.cancelText}
            </Button>
            <Button {...okBtnProps}>
              {getComponentFromProp(this, 'okText') || popconfirmLocale.okText}
            </Button>
          </div>
        </div>
      );
    },
  },
  render() {
    const props = getOptionProps(this);
    const otherProps = omit(props, ['title', 'content', 'cancelText', 'okText']);
    const tooltipProps = {
      props: {
        ...otherProps,
        visible: this.sVisible,
      },
      ref: 'tooltip',
      on: {
        visibleChange: this.onVisibleChange,
      },
    };
    const overlay = (
      <LocaleReceiver
        componentName="Popconfirm"
        defaultLocale={defaultLocale.Popconfirm}
        scopedSlots={{ default: this.renderOverlay }}
      />
    );
    return (
      <Tooltip {...tooltipProps}>
        <template slot="title">{overlay}</template>
        {this.$slots.default}
      </Tooltip>
    );
  },
};

/* istanbul ignore next */
Popconfirm.install = function(Vue) {
  Vue.component(Popconfirm.name, Popconfirm);
};

export default Popconfirm;
