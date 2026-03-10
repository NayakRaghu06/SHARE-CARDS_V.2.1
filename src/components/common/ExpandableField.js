import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

const ExpandableField = ({
  label,
  value,
  fieldKey,
  expandedField,
  setExpandedField,
  onPressAction,
  containerStyle,
  labelStyle,
  valueStyle,
}) => {
  const isExpanded = expandedField === fieldKey;

  const toggle = () => {
    if (setExpandedField) {
      setExpandedField(isExpanded ? null : fieldKey);
    }
    if (onPressAction) {
      onPressAction();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.fieldBox, containerStyle]}
      onPress={toggle}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={styles.labelBox}>
          <Text
            style={[styles.label, labelStyle]}
          >
            {label}
          </Text>
        </View>

        <View style={styles.valueBox}>
          <Text
            style={[styles.value, valueStyle]}
            numberOfLines={isExpanded ? undefined : 1}
            ellipsizeMode="tail"
          >
            {value || "-"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ExpandableField;

const styles = StyleSheet.create({
  fieldBox: {
    width: "100%",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  labelBox: {
    flex: 0.42,
    paddingRight: 8,
    flexShrink: 0,
  },
  valueBox: {
    flex: 0.58,
    overflow: "hidden",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EDEDED",
  },
  value: {
    fontSize: 14,
    color: "#D1D5DB",
    marginLeft: 0,
  },
});
