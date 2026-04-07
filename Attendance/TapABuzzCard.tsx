import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { EventInfo, TeamInfo } from '../Api/MeetingsApi';
import { AttendableType } from '../Api/Models/Attendance';
import MenuHeader from '../Components/MenuHeader';
import RoundedButton from '../Components/RoundedButton';
import BuzzCardPrompt from './BuzzCardPrompt';

type AttendanceProps = {
  attendanceType: AttendableType;
  setAttendanceType: (state: AttendableType) => void;
  attendable: TeamInfo | EventInfo;
  setAttendable: (state: TeamInfo | EventInfo | undefined) => void;
};

export type LastAttendeeProps = {
  name: string;
  id: number;
};

const AttendanceGoals: { [key: number]: string } = {
  5: "🔥 5 attendees recorded. You're on a roll!",
  10: "👑 10 attendees. You're awesome!",
  25: "🎸 25 attendees! You're a rockstar!",
  42: '4️⃣2️⃣ The meaning of life.',
  50: '🎉 50 attendees! Is this GI?',
  100: '💯 100 ATTENDEES! Go give yourself a prize!',
};

function TapABuzzCard({
  attendanceType,
  setAttendanceType,
  attendable,
  setAttendable,
}: AttendanceProps) {
  const [totalAttendees, setTotalAttendees] = useState<number>(0);
  const [lastAttendee, setLastAttendee] = useState<LastAttendeeProps | null>(null);

  function TopPanel() {
    return (
      <View>
        <RoundedButton
          title="Change team or event"
          onPress={() => {
            setAttendable(undefined);
            setAttendanceType(AttendableType.NONE);
          }}
        />
        <MenuHeader title={`Recording attendance for ${attendable.name}`}></MenuHeader>
        <Text style={styles.topPanelText}>Last attendee: {lastAttendee?.name || 'None'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopPanel></TopPanel>
      <BuzzCardPrompt
        attendable={attendable}
        setTotalAttendees={setTotalAttendees}
        setLastAttendee={setLastAttendee}
        attendanceType={attendanceType}
      ></BuzzCardPrompt>
      <View style={styles.bottomPanel}>
        <Text style={styles.bottomPanelText}>Total attendees: {totalAttendees}</Text>
        {totalAttendees in AttendanceGoals && (
          <Text style={styles.bottomPanelText}>{AttendanceGoals[totalAttendees]}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomPanel: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
    paddingHorizontal: 10,
  },
  bottomPanelText: {
    fontSize: 20,
    textAlign: 'right',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  topPanelText: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
});

export default TapABuzzCard;
