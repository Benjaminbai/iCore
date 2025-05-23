<template>
  <Table v-bind="{ ...dataConfig }" :size="size[0]" rowKey="id">
    <template #title>
      <Flex justify="space-between" align="center">
        <slot name="tools" />
        <Space size="large">
          <Tooltip>
            <template #title>刷新</template>
            <ReloadOutlined class="icon" @click="refreashHandler" />
          </Tooltip>
          <Tooltip>
            <template #title>密度</template>
            <Dropdown>
              <ColumnHeightOutlined class="icon" />
              <template #overlay>
                <Menu
                  v-model:selectedKeys="size"
                  @click="(e) => (size[0] = e.key)"
                >
                  <MenuItem key="large">
                    <a href="javascript:;">宽松</a>
                  </MenuItem>
                  <MenuItem key="middle">
                    <a href="javascript:;">默认</a>
                  </MenuItem>
                  <MenuItem key="small">
                    <a href="javascript:;">紧凑</a>
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </Tooltip>

          <Tooltip>
            <template #title>列设置</template>
            <Popover placement="bottomRight" arrowPointAtCenter>
              <template #title>
                <Checkbox
                  v-model:checked="dataConfig.checkedState.checkAll"
                  @change="onCheckAllChange"
                >
                  列展示
                </Checkbox>
              </template>
              <template #content>
                <CheckboxGroup
                  v-model:value="dataConfig.checkedState.checkedList"
                >
                  <Draggable
                    :list="dataConfig.backupList"
                    group="table"
                    item-key="dataIndex"
                    @end="onDragEnd"
                  >
                    <template #item="{ element }">
                      <div class="checkbox-group-item">
                        <space>
                          <DragOutlined style="cursor: move" />
                          <Checkbox
                            :key="element.dataIndex"
                            :value="element.dataIndex"
                            >{{ element.title }}</Checkbox
                          >
                        </space>
                      </div>
                    </template>
                  </Draggable>
                </CheckboxGroup>
              </template>
              <SettingOutlined class="icon" />
            </Popover>
          </Tooltip>
        </Space>
      </Flex>
      <Alert
        v-if="dataConfig?.selectedKeys"
        :message="`已选中 ${dataConfig?.selectedKeys.length || 0} 条记录`"
        type="info"
        show-icon
        class="alert"
      />
    </template>
    <template v-for="slot in Object.keys(slots)" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}"></slot>
    </template>
  </Table>
</template>

<script setup>
import {
  Table,
  Flex,
  Space,
  Tooltip,
  Dropdown,
  Menu,
  MenuItem,
  Popover,
  Checkbox,
  CheckboxGroup,
  Alert,
} from "ant-design-vue";
import {
  ReloadOutlined,
  ColumnHeightOutlined,
  SettingOutlined,
  DragOutlined,
} from "@ant-design/icons-vue";
import { reactive, watch, useSlots } from "vue";
import Draggable from "vuedraggable";

const slots = useSlots();
const { dataConfig } = defineProps({
  dataConfig: {
    type: Object,
    default: () => ({
      backupList: [],
      columns: [],
      checkedState: {
        checkAll: false,
        checkedList: [],
      },
      selectedKeys: [],
    }),
  },
  refreashHandler: {
    type: Function,
    default: () => () => {},
  },
});

const size = reactive(["middle"]);

const onCheckAllChange = (e) => {
  Object.assign(dataConfig.checkedState, {
    checkedList: e.target.checked
      ? dataConfig.backupList.map((item) => item.dataIndex)
      : [],
  });
};

const onDragEnd = () => {
  dataConfig.checkedState.checkedList = dataConfig.backupList.map(
    (item) => item.dataIndex
  );
  resort(dataConfig.checkedState.checkedList);
};
watch(
  () => dataConfig.checkedState.checkedList,
  (val) => {
    dataConfig.checkedState.checkAll =
      val.length === dataConfig.backupList.length;
    resort(val);
  }
);
const resort = (val) => {
  if (val.length === 0) {
    dataConfig.columns.splice(0, dataConfig.columns.length);
  } else {
    const tempArr = [];
    val.forEach((item) => {
      dataConfig.backupList.filter((option) => {
        if (option.dataIndex === item) {
          tempArr.push(option);
        }
      });
    });
    dataConfig.columns.splice(0, dataConfig.columns.length);
    tempArr.forEach((item) => dataConfig.columns.push(item));
  }
};
</script>

<style scoped>
.checkbox-group-item {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.alert {
  margin-top: 10px;
}
.icon {
  font-size: 16px;
}
</style>
