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
      <View style={styles.cardHeader}>
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
        </View>
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={() => confirmDelete(item.cardId)}
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={() => handlePreview(item)}
          style={styles.actionBtn}
        >
          <Ionicons name="eye-outline" size={16} color="#D4AF37" />
          <Text style={styles.actionText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditCardScreen", { cardData: item })
          }
          style={styles.actionBtn}
        >
          <Ionicons name="create-outline" size={16} color="#D4AF37" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleShare(item)}
          style={styles.actionBtn}
        >
          <Ionicons name="share-social-outline" size={16} color="#D4AF37" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />

      <Text style={styles.title}>My Cards</Text>

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
    backgroundColor: "#F8F9FB",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginVertical: 16,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0E6C8",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardText: {
    flex: 1,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#F3E7B5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3E7B5",
    marginRight: 14,
  },

  cardName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  cardDesignation: {
    fontSize: 14,
    color: "#4A5568",
    marginTop: 2,
  },

  companyName: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  trashBtn: {
    padding: 6,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 4,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 6,
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
    color: "#111827",
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
    color: "#111827",
    fontWeight: "600",
  },
});
