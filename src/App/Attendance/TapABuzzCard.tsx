import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useApi } from '../../Api/ApiContextProvider';
import { EventInfo, TeamInfo, postAttendance } from '../../Api/AttendanceApi';
import BuzzCardPrompt, { BuzzCardTap } from '../../Components/BuzzCardPrompt';
import MenuHeader from '../../Components/MenuHeader';
import RoundedButton from '../../Components/RoundedButton';
import ThemedText from '../../Components/ThemedText';
import { AttendableType } from '../../constants/api/Models/Attendance';

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
  const api = useApi();
  const lastGtidRef = useRef<number | null>(null); // keep track of last gtid to prevent duplicates
  const [totalAttendees, setTotalAttendees] = useState<number>(0);
  const [lastAttendee, setLastAttendee] = useState<LastAttendeeProps | null>(null);

  const recordAttendance = async ({ gtid, source }: BuzzCardTap) => {
    const props = {
      attendable_type: attendanceType,
      attendable_id: attendable.id,
      gtid: gtid,
      source: `MyRoboJackets ${Platform.OS === 'ios' ? 'iOS' : 'Android'} - ${source}`,
    };

    const res = await postAttendance(api, props);
    if (!res.success) {
      throw new Error('Failed to record attendance');
    }

    if (lastGtidRef.current !== gtid) {
      setTotalAttendees((prev) => prev + 1);
      lastGtidRef.current = gtid;
    }
    const attendeeName = res.data.attendance.attendee?.name ?? 'Non-member';
    setLastAttendee({
      id: gtid,
      name: attendeeName,
    });
  };

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
      <BuzzCardPrompt onBuzzCardTap={recordAttendance}></BuzzCardPrompt>
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
