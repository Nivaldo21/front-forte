import { createApp } from 'vue';
import './style.css';
import router from './router';
import App from './App.vue';
import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { MdAttachmoney, MdBalanceTwotone, MdMoneyoff, RiUser2Fill,FaSearchDollar, MdAddcircleoutlineTwotone, HiTrash, MdEditOutlined, IoReceipt, IoCloseCircleSharp, MdSpacedashboardOutlined, SiMoneygram, BiSendPlusFill, HiSolidReceiptRefund, MdCalendarmonthOutlined, MdCategoryOutlined, IoOptions} from 'oh-vue-icons/icons';
addIcons(MdAttachmoney, MdBalanceTwotone, MdMoneyoff, RiUser2Fill,FaSearchDollar, MdAddcircleoutlineTwotone, HiTrash, MdEditOutlined, IoReceipt, IoCloseCircleSharp, MdSpacedashboardOutlined, SiMoneygram, BiSendPlusFill, HiSolidReceiptRefund, MdCalendarmonthOutlined,MdCategoryOutlined, IoOptions);
const options: PluginOptions = {
    position: POSITION.BOTTOM_CENTER,
    timeout: 4000,
    pauseOnHover: false,
    showCloseButtonOnHover: true,
};
const app = createApp(App);
app.component('v-icon', OhVueIcon);
app.use(router);
app.use(Toast,options);
app.mount('#app');