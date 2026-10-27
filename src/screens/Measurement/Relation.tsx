
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

import ThemeContext from '../../context/ThemeContext';
import {
  InsertRelation,
  GetRelations,
  UpdateRelation,
  DeleteRelation,
} from '../../database/table';
import CustomAlert from '../../components/CustomAlert';
export default function Relation() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Customer ki ID previous screen se receive hogi
  const Customer_id = route.params?.id;

  const { theme } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Brother');
const [members, setMembers] = useState<any[]>([]);
const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
const [alertVisible, setAlertVisible] = useState(false);
const [selectedMember, setSelectedMember] = useState<any>(null);

  const options = [
    'Brother',
    'Sister',
    'Mother',
    'Father',
    'Son',
    'Daughter',
    'Other',
  ];
useEffect(() => {
  const getMembers = async () => {
    const data = await GetRelations(Number(Customer_id));
    setMembers(data);
  };

  if (Customer_id) {
    getMembers();
  }
}, [Customer_id]);


  // Family member ko database mein save karna
const addMember = async () => {
  setError('');

  if (!name.trim()) {
    setError('Name field cannot be empty');
    return;
  }

  if (!Customer_id || Number.isNaN(Number(Customer_id))) {
    setError('Customer ID nahi mili');
    return;
  }

  if (loader) return;

  setLoader(true);

  try {
    let success: boolean;

    if (editingId !== null) {
      success = await UpdateRelation(
        editingId,
        name.trim(),
        relation,
      );
    } else {
      success = await InsertRelation(
        Number(Customer_id),
        name.trim(),
        relation,
      );
    }

    if (!success) {
      setError('Operation failed. Dobara try karein.');
      return;
    }

    const data = await GetRelations(Number(Customer_id));
    setMembers(data);

    setName('');
    setRelation('Brother');
    setEditingId(null);

    ToastAndroid.show(
      editingId !== null
        ? 'Member updated successfully'
        : 'Member added successfully',
      ToastAndroid.SHORT,
    );
  } catch (err) {
    console.log('Save Relation Error:', err);
    setError('Kuch masla hua. Dobara try karein.');
  } finally {
    setLoader(false);
  }
};
const editMember = (item: any) => {
  setName(item.NAME);
  setRelation(item.RELATION);
  setEditingId(item.Relation_ID);
  setError('');
};

const cancelEdit = () => {
  setName('');
  setRelation('Brother');
  setEditingId(null);
  setError('');
};

const deleteMember = (relationId: number) => {
  Alert.alert(
    'Delete Member',
    'Kya aap is family member ko delete karna chahti hain?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const success = await DeleteRelation(relationId);

            if (success) {
              const data = await GetRelations(Number(Customer_id));
              setMembers(data);

              if (editingId === relationId) {
                cancelEdit();
              }

              ToastAndroid.show(
                'Member deleted successfully',
                ToastAndroid.SHORT,
              );
            } else {
              setError('Member delete nahi hua.');
            }
          } catch (error) {
            console.log('Delete Member Error:', error);
            setError('Delete karte waqt masla hua.');
          }
        },
      },
    ],
  );
};

  // Theme ke mutabiq styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: 20,
      paddingBottom: 30,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 15,
      marginTop: 10,
    },
    label: {
      fontSize: 15,
      color: theme.text,
      marginBottom: 7,
    },
    input: {
      backgroundColor: theme.input,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      padding: 12,
      marginBottom: 18,
      color: theme.text,
    },
    relations: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 20,
    },
    option: {
      paddingVertical: 9,
      paddingHorizontal: 13,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 20,
      backgroundColor: theme.card,
    },
    selected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    optionText: {
      color: theme.text,
    },
    selectedText: {
      color: theme.card,
    },
    addButton: {
      backgroundColor: theme.primary,
      padding: 14,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginBottom: 20,
    },
    disabledButton: {
      opacity: 0.6,
    },
    addText: {
      color: theme.card,
      fontWeight: 'bold',
    },
    member: {
      backgroundColor: theme.card,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    memberName: {
      color: "theme.primary",
      fontSize: 16,
      fontWeight: 'bold',
    },
    memberRelation: {
      color: theme.textSecondary,
      marginTop: 4,
    },
    measurementButton: {
      padding: 8,
    },
    errorText: {
      color: theme.danger,
      fontSize: 13,
      marginTop: -12,
      marginBottom: 12,
    },
    emptyText: {
      color: theme.primary,
      fontSize: 14,
      marginTop:0,
    },
  });

 
return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    keyboardShouldPersistTaps="handled"
  >
    <Text style={styles.title}>
      {editingId !== null ? 'Edit Relation' : 'Add Relation'}
    </Text>

    <Text style={styles.label}>Member Name</Text>

    <TextInput
      style={styles.input}
      placeholder="Enter name"
      placeholderTextColor={theme.textSecondary}
      value={name}
      onChangeText={setName}
      editable={!loader}
    />

    {error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : null}

    <Text style={styles.label}>Select Relation</Text>

    <View style={styles.relations}>
      {options.map(item => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            relation === item && styles.selected,
          ]}
          onPress={() => setRelation(item)}
          disabled={loader}
        >
          <Text
            style={[
              styles.optionText,
              relation === item && styles.selectedText,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity
      style={[
        styles.addButton,
        loader && styles.disabledButton,
      ]}
      onPress={addMember}
      disabled={loader}
    >
      {loader ? (
        <ActivityIndicator color={theme.card} />
      ) : (
        <Ionicons
          name={editingId !== null ? 'save-outline' : 'add-circle-outline'}
          size={20}
          color={theme.card}
        />
      )}

      <Text style={styles.addText}>
        {loader
          ? 'Please wait...'
          : editingId !== null
            ? 'Update Relation'
            : 'Add Relation'}
      </Text>
    </TouchableOpacity>

    {editingId !== null && (
      <TouchableOpacity
        onPress={cancelEdit}
        style={{ alignItems: 'center', marginBottom: 20 }}
      >
        <Text style={{ color: theme.text }}>Cancel Edit</Text>
      </TouchableOpacity>
    )}

    <Text style={styles.title}>Family Members</Text>

    {members.length === 0 ? (
      <Text style={styles.emptyText}>
        No members added yet
      </Text>
    ) : (
      members.map(item => (
        <View
          key={item.Relation_ID}
          style={styles.member}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>
              {item.NAME}
            </Text>

            <Text style={styles.memberRelation}>
              {item.RELATION}
            </Text>
          </View>

          {/* Measurement */}
          
<TouchableOpacity
  style={styles.measurementButton}
  onPress={() =>
    navigation.navigate('MeasurementStack', {
      screen: 'AddMeasurement',
      params: {
        id: String(Customer_id),
        relationId: String(item.Relation_ID),
      },
    })
  }
>
  <Ionicons
    name="resize-outline"
    size={22}
    color={theme.primary}
  />
</TouchableOpacity>


          {/* Edit */}
          <TouchableOpacity
            style={styles.measurementButton}
            onPress={() => editMember(item)}
          >
            <Ionicons
              name="create-outline"
              size={22}
              color={theme.primary}
            />
          </TouchableOpacity>

          {/* Delete */}
          <TouchableOpacity
            style={styles.measurementButton}
            onPress={() => deleteMember(item.Relation_ID)}
          >
            <Ionicons
              name="trash-outline"
              size={22}
              color={theme.danger}
            />
          </TouchableOpacity>
        </View>
      ))
    )}
  </ScrollView>
);

}