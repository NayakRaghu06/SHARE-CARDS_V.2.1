import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Linking, Alert } from "react-native";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import ExpandableField from "../../components/common/ExpandableField";

const ClassicTemplate = ({ userData, data }) => {

  const d = data || userData || {};
  const phone = d.phone || d.mobile || null;
  const initial = d?.name ? d.name.trim().charAt(0).toUpperCase() : "Y";

  const [expandedField, setExpandedField] = useState(null);

  const handlePdf = async (pdf) => {
    if (!pdf) return;

    try {
      let uri =
        typeof pdf === "string"
          ? pdf
          : pdf.uri || pdf.fileUri || pdf.localUri || pdf.path || pdf.url;

      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch {
      Alert.alert("Error", "Failed to open PDF");
    }
  };

  return (
    <View style={styles.card}>

      {d?.companyLogo && (
        <Image source={{ uri: d.companyLogo }} style={styles.companyLogo} />
      )}

      <View style={styles.avatarOuter}>
        <View style={styles.avatarInner}>
          {d?.profileImage ? (
            <Image source={{ uri: d.profileImage }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{initial}</Text>
          )}
        </View>
      </View>

      <View style={styles.fieldsContainer}>

        <ExpandableField
          label="Name"
          value={d?.name}
          fieldKey="name"
          expandedField={expandedField}
          setExpandedField={setExpandedField}
        />

        {d?.designation && (
          <ExpandableField
            label="Designation"
            value={d.designation}
            fieldKey="designation"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {d?.companyName && (
          <ExpandableField
            label="Company Name"
            value={d.companyName}
            fieldKey="company"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {(d?.description || d?.businessDescription) && (
          <ExpandableField
            label="Business Description"
            value={d.description || d.businessDescription}
            fieldKey="description"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {phone && (
          <ExpandableField
            label="Mobile"
            value={phone}
            fieldKey="mobile"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {d?.email && (
          <ExpandableField
            label="Email"
            value={d.email}
            fieldKey="email"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {d?.website && (
          <ExpandableField
            label="Website"
            value={d.website}
            fieldKey="website"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

        {d?.address && (
          <ExpandableField
            label="Address"
            value={d.address}
            fieldKey="address"
            expandedField={expandedField}
            setExpandedField={setExpandedField}
          />
        )}

      </View>

      <View style={styles.socialRow}>

        {phone && (
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Ionicons name="call" size={18} color="#D4AF37" />
          </TouchableOpacity>
        )}

        {d?.website && (
          <TouchableOpacity onPress={() => Linking.openURL(d.website)}>
            <Ionicons name="globe" size={18} color="#D4AF37" />
          </TouchableOpacity>
        )}

        {d?.descriptionPdf && (
          <TouchableOpacity onPress={() => handlePdf(d.descriptionPdf)}>
            <Ionicons name="document" size={18} color="#D4AF37" />
          </TouchableOpacity>
        )}

      </View>

    </View>
  );
};

export default ClassicTemplate;

const styles = StyleSheet.create({

  card: {
    margin: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#070912",
    borderWidth: 1,
    borderColor: "#0F1724",
    alignItems: "center",
    width: "92%",
  },

  avatarOuter: {
    borderWidth: 3,
    borderColor: "#D4AF37",
    borderRadius: 48,
    padding: 4,
    marginBottom: 12,
  },

  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#0B1023",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 34,
    color: "#D4AF37",
    fontWeight: "bold",
  },

  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },

  companyLogo: {
    position: "absolute",
    left: 12,
    top: 12,
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  fieldsContainer: {
    width: "100%",
    marginTop: 8,
  },

  socialRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-around",
    width: "100%",
  },

});
