import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EventInfo, TeamInfo } from '../../Api/AttendanceApi';
import MenuHeader from '../../Components/MenuHeader';
import RoundedButton from '../../Components/RoundedButton';
import ThemedText from '../../Components/ThemedText';
import { AttendableType } from '../../constants/api/Models/Attendance';
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
        <ThemedText
          style={styles.topPanelText}
          title={`Last attendee: ${lastAttendee?.name || 'None'}`}
        />
      </View>
    );
  }

  return (
    <>
      <TopPanel></TopPanel>
      <BuzzCardPrompt
        attendable={attendable}
        setTotalAttendees={setTotalAttendees}
        setLastAttendee={setLastAttendee}
        attendanceType={attendanceType}
      ></BuzzCardPrompt>
      <View style={styles.bottomPanel}>
        <ThemedText style={styles.bottomPanelText} title={`Total attendees: ${totalAttendees}`} />
        {totalAttendees in AttendanceGoals && (
          <ThemedText style={styles.bottomPanelText} title={AttendanceGoals[totalAttendees]} />
        )}
      </View>
    </>
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
  topPanelText: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
});

export default TapABuzzCard;
