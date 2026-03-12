import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/common/AppHeader";
import { apiFetch } from "../../utils/api";
import FS from "../../styles/typography";

export default function MyCardsScreen({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const { res, data } = await apiFetch(
        "/api/cards/view-cards",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        navigation.replace("Login");
        return;
      }

      const payload = Array.isArray(data) ? data : [];
      setCards(payload);
    } catch (err) {
      setErrorMessage("Unable to load cards. Pull to retry.");
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useEffect(() => {
    loadCards();
    const unsubscribe = navigation.addListener("focus", loadCards);
    return unsubscribe;
  }, [loadCards, navigation]);

  const handlePreview = (card) => {
    if (!card?.cardId) return;
    navigation.navigate("CardDetailsScreen", {
      cardId: card.cardId,
      cardData: card,
    });
  };

  const handleShare = (card) => {
    if (!card?.cardId) return;
    navigation.navigate("ShareCardScreen", {
      cardId: card.cardId,
      cardData: card,
    });
  };

  const deleteCardFromState = (cardId) => {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
  };

  const handleDelete = async (cardId) => {
    if (!cardId) return;
    try {
      const { res, data } = await apiFetch(`/api/cards/delete-card/${cardId}`, {
        method: "DELETE",
      });
      if (res.status === 401) {
        navigation.replace("Login");
        return;
      }
      if (!res.ok) {
        Alert.alert("Error", data?.message || "Unable to delete card");
        return;
      }
      deleteCardFromState(cardId);
      Alert.alert("Deleted", "Card deleted successfully.");
    } catch (e) {
      Alert.alert("Error", e?.message || "Failed to delete card.");
    }
  };

  const confirmDelete = (cardId) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => handleDelete(cardId) },
    ]);
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardTop} onPress={() => handlePreview(item)} activeOpacity={0.85}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color="#D4AF37" />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardName}>{item.name || "Unnamed Card"}</Text>
          <Text style={styles.cardDesignation}>
            {item.designation || "Designation"}
          </Text>
          {item.companyName && (
            <Text style={styles.companyName}>{item.companyName}</Text>
          )}
          {item.phone && (
            <Text style={styles.phoneText}>{item.phone}</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => handleShare(item)}
          style={styles.shareSection}
        >
          <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditCardScreen", { cardData: item })}
          style={styles.editSection}
        >
          <Ionicons name="create-outline" size={16} color="#2563EB" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => confirmDelete(item.cardId)}
          style={styles.deleteSection}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <Text style={styles.title}></Text>

      {loading && cards.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : errorMessage ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{errorMessage}</Text>

          <TouchableOpacity onPress={loadCards} style={styles.retryButton}>
            <Text style={styles.retryLabel}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cards saved yet</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("PersonalDetails")}
            style={styles.emptyAction}
          >
            <Text style={styles.emptyActionText}>
              Create Your First Card
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => String(item.cardId ?? Math.random())}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await loadCards();
            setRefreshing(false);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: FS.h3,
    fontWeight: "700",
    color: "#D4AF37",
    textAlign: "center",
    marginVertical: 16,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    overflow: "hidden",
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
  },

  cardText: {
    flex: 1,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
    marginRight: 14,
  },

  cardName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cardDesignation: {
    fontSize: 16,
    color: "#D4AF37",
    marginTop: 2,
  },

  companyName: {
    fontSize: 16,
    color: "#CBD5E1",
    marginTop: 4,
  },

  phoneText: {
    fontSize: 14,
    color: "#CBD5E1",
    marginTop: 2,
  },

  actionsRow: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  shareSection: {
    flex: 1,
    backgroundColor: "#D4AF37",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },

  shareText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: FS.base,
    marginLeft: 5,
  },

  editSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },

  editText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: FS.base,
    marginLeft: 5,
  },

  deleteSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
  },

  deleteText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: FS.base,
    marginLeft: 5,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  emptyAction: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 26,
    backgroundColor: "#D4AF37",
    borderRadius: 14,
  },

  emptyActionText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  retryButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#D4AF37",
    borderRadius: 12,
  },

  retryLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
