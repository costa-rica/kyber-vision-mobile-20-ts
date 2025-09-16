// import React, { useState, useEffect } from "react";
// import {
// 	StyleSheet,
// 	Text,
// 	View,
// 	Image,
// 	Dimensions,
// 	FlatList,
// 	Pressable,
// 	TextInput,
// 	Alert,
// } from "react-native";

// import ScreenFrameWithTopChildren from "../../components/screen-frames/ScreenFrameWithTopChildren";
// import Tribe from "../../assets/images/welcome/Tribe.svg";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../../types/store";
// import type { JoinPublicTeamScreenProps } from "../../types/navigation";
// import team, { Team, updatePublicTeamsArray } from "../../reducers/team";
// import ButtonKvNoDefaultTextOnly from "../../components/buttons/ButtonKvNoDefaultTextOnly";

// export default function JoinPublicTeam({
// 	navigation,
// }: JoinPublicTeamScreenProps) {
// 	const userReducer = useSelector((state: RootState) => state.user);
// 	const teamReducer = useSelector((state: RootState) => state.team);
// 	const dispatch = useDispatch();
// 	const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
// 	const topChildren = (
// 		<View style={styles.vwTopChildren}>
// 			<Text style={styles.txtTopChildren}>
// 				Welcome {userReducer.user.username}
// 			</Text>
// 		</View>
// 	);
// 	useEffect(() => {
// 		fetchPublicTeams();
// 	}, []);

// 	const fetchPublicTeams = async () => {
// 		try {
// 			const response = await fetch(
// 				`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/public`,
// 				{
// 					method: "GET",
// 					headers: {
// 						"Content-Type": "application/json",
// 						Authorization: `Bearer ${userReducer.token}`,
// 					},
// 				}
// 			);

// 			// Safely parse JSON only if Content-Type is JSON
// 			const contentType = response.headers.get("content-type") ?? "";
// 			const resJson = contentType.includes("application/json")
// 				? await response.json()
// 				: null;

// 			// Handle non-2xx responses
// 			if (!response.ok) {
// 				const errorMessage =
// 					resJson?.error ||
// 					`There was a server error: ${response.status} ${response.statusText}`;
// 				Alert.alert("Error", errorMessage);
// 				// Ensure reducer is cleared on error to avoid stale data
// 				dispatch(updatePublicTeamsArray([]));
// 				return;
// 			}

// 			// Validate payload shape
// 			const rawArray = Array.isArray(resJson?.publicTeamsArray)
// 				? resJson.publicTeamsArray
// 				: [];

// 			// Normalize to your reducer Team type and add defaults for possibly missing fields
// 			const normalizedAll: Team[] = rawArray.map(
// 				(t: any): Team => ({
// 					id: Number(t.id),
// 					teamName: String(t.teamName ?? ""),
// 					city: String(t.city ?? ""), // default empty if not returned by API
// 					coachName: String(t.coachName ?? ""), // default empty if not returned by API
// 					practiceMatch: t.practiceMatch ?? null,
// 					selected: false, // ensure selectable in UI
// 					genericJoinToken: t.genericJoinToken ?? undefined,
// 					visibility: t.visibility ?? undefined,
// 					description: t.description ?? undefined,
// 				})
// 			);

// 			// Filter out teams the user already belongs to
// 			const existingIds = new Set(teamReducer.teamsArray.map((t) => t.id));
// 			const remaining = normalizedAll.filter((t) => !existingIds.has(t.id));

// 			// Update reducer (always dispatch, even if empty array)
// 			dispatch(updatePublicTeamsArray(remaining));
// 		} catch (error) {
// 			console.error("Fetch teams error:", error);
// 			Alert.alert("Error", "Network error. Please try again.");
// 			// Clear list on network error to avoid stale state
// 			dispatch(updatePublicTeamsArray([]));
// 		}
// 	};

// 	// const fetchPublicTeams = async () => {
// 	// 	try {
// 	// 		const response = await fetch(
// 	// 			`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/public`,
// 	// 			{
// 	// 				method: "GET",
// 	// 				headers: {
// 	// 					"Content-Type": "application/json",
// 	// 					Authorization: `Bearer ${userReducer.token}`,
// 	// 				},
// 	// 			}
// 	// 		);

// 	// 		let resJson = null;
// 	// 		const contentType = response.headers.get("Content-Type");

// 	// 		if (contentType?.includes("application/json")) {
// 	// 			resJson = await response.json();
// 	// 			// console.log("content type is application/json");
// 	// 		} else {
// 	// 			console.log("Content-Type is not application/json");
// 	// 		}

// 	// 		// if (response.ok && resJson.publicTeamsArray) {
// 	// 		if (response.ok) {
// 	// 			// console.log("response.ok && resJson.publicTeamsArray");
// 	// 			const tempArray = resJson.publicTeamsArray.map((team: any) => {
// 	// 				// if it is not already in the teamReducer.teamsArray
// 	// 				if (!teamReducer.teamsArray.some((t) => t.id === team.id)) {
// 	// 					return {
// 	// 						...team,
// 	// 						selected: false,
// 	// 					};
// 	// 				}
// 	// 				return null;
// 	// 			});
// 	// 			console.log("--- publicTeamsArray adjusted ---");
// 	// 			console.log(JSON.stringify(tempArray));
// 	// 			console.log("------------------------");
// 	// 			//// ---> here:				dispatch(updatePublicTeamsArray(tempArray));
// 	// 		} else {
// 	// 			const errorMessage =
// 	// 				resJson?.error ||
// 	// 				`There was a server error (and no resJson): ${response.status}`;
// 	// 			Alert.alert("Error", errorMessage);
// 	// 		}
// 	// 	} catch (error) {
// 	// 		console.error("Fetch teams error:", error);
// 	// 		Alert.alert("Error", "Network error. Please try again.");
// 	// 	}
// 	// };

// 	const handleRequestJoinTeam = async () => {
// 		// try {
// 		// 	const response = await fetch(
// 		// 		`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/add-squad-member`,
// 		// 		{
// 		// 			method: "POST",
// 		// 			headers: {
// 		// 				"Content-Type": "application/json",
// 		// 				Authorization: `Bearer ${userReducer.token}`,
// 		// 			},
// 		// 			body: JSON.stringify({
// 		// 				teamId: selectedTeam?.id,
// 		// 				email: userReducer.user.email,
// 		// 			}),
// 		// 		}
// 		// 	);
// 		// } catch (error) {
// 		//   console.error("Join team error:", error);
// 		//   Alert.alert("Error", "Network error. Please try again.");
// 		// }
// 	};

// 	const selectTeamRow = ({ item }: { item: Team }) => {
// 		const isSelected = item.selected;

// 		return (
// 			<Pressable
// 				onPress={() => {
// 					setSelectedTeam(item);
// 				}}
// 				style={[
// 					styles.vwTeamRow,
// 					selectedTeam?.id === item.id && styles.vwTeamRowSelected,
// 				]}
// 			>
// 				<Text style={styles.txtTeamName}>{item.teamName}</Text>
// 			</Pressable>
// 		);
// 	};

// 	return (
// 		<ScreenFrameWithTopChildren
// 			navigation={navigation}
// 			topChildren={topChildren}
// 		>
// 			<View style={styles.container}>
// 				<View style={styles.containerTop}>
// 					<Tribe width={80} height={80} />
// 					{Array.isArray(teamReducer.publicTeamsArray) &&
// 					teamReducer.publicTeamsArray.length > 0 ? (
// 						<FlatList
// 							data={teamReducer.publicTeamsArray}
// 							renderItem={selectTeamRow}
// 							keyExtractor={(item) => item.id.toString()}
// 							style={styles.flatListTeamNames}
// 						/>
// 					) : (
// 						<View style={styles.vwNoTeamInfo}>
// 							<Text style={styles.txtNoTeamInfo}>
// 								There are no public teams to join
// 							</Text>
// 							<Text style={styles.txtNoTeamInfo}>
// 								You can create your own team
// 							</Text>
// 						</View>
// 					)}
// 				</View>
// 				<View style={styles.containerBottom}>
// 					<View style={styles.vwInputGroup}>
// 						<ButtonKvNoDefaultTextOnly
// 							onPress={() => {
// 								// navigation.navigate("Home");
// 								handleRequestJoinTeam();
// 							}}
// 							styleView={styles.btnTribe}
// 							styleText={styles.btnTribeText}
// 						>
// 							Join Team
// 						</ButtonKvNoDefaultTextOnly>
// 					</View>
// 				</View>
// 			</View>
// 		</ScreenFrameWithTopChildren>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: "#FDFDFD",
// 		width: "100%",
// 	},
// 	vwTopChildren: {
// 		alignItems: "center",
// 		justifyContent: "center",
// 		padding: 20,
// 	},
// 	txtTopChildren: {
// 		color: "white",
// 		fontSize: 20,
// 		fontWeight: "bold",
// 	},
// 	// Top
// 	containerTop: {
// 		alignItems: "center",
// 		// justifyContent: "center",
// 		paddingHorizontal: 10,
// 		flex: 1,
// 		// backgroundColor: "blue",
// 		height: "100%",
// 	},
// 	vwInputGroup: {
// 		width: "90%",
// 		alignItems: "center",
// 		paddingTop: 10,
// 	},
// 	// FlatList
// 	flatListTeamNames: {
// 		width: "100%",
// 		borderColor: "gray",
// 		borderWidth: 1,
// 		borderStyle: "solid",
// 		borderRadius: 10,
// 		padding: 5,
// 		// marginTop: 20,
// 		minHeight: 100,
// 	},
// 	vwTeamRow: {
// 		padding: 15,
// 		marginVertical: 5,
// 		backgroundColor: "#F0F0F0",
// 		borderRadius: 5,
// 		width: "100%",
// 	},
// 	vwTeamRowSelected: {
// 		backgroundColor: "#D3D3D3",
// 	},
// 	txtTeamName: {
// 		fontSize: 16,
// 		textAlign: "center",
// 		fontWeight: "500",
// 	},
// 	vwNoTeamInfo: {
// 		alignItems: "center",
// 		width: "70%",
// 		gap: 20,
// 		marginTop: 20,
// 	},
// 	txtNoTeamInfo: {
// 		fontSize: 16,
// 		color: "#806181",
// 		textAlign: "center",
// 	},
// 	// Bottom
// 	containerBottom: {
// 		alignItems: "center",
// 		justifyContent: "center",
// 		paddingBottom: Dimensions.get("window").height * 0.075,
// 		// backgroundColor: "green",
// 	},
// 	btnTribe: {
// 		width: Dimensions.get("window").width * 0.6,
// 		height: 50,
// 		justifyContent: "center",
// 		backgroundColor: "#C0A9C0",
// 		borderRadius: 35,
// 		alignItems: "center",
// 	},
// 	btnTribeText: {
// 		color: "white",
// 		fontSize: 18,
// 	},
// 	vwInputAndButton: {
// 		width: "100%",
// 		// gap: 10,
// 		marginTop: 30,
// 		alignItems: "center",
// 		flexDirection: "row",
// 		paddingRight: 10,
// 		paddingLeft: 20,
// 	},
// 	btnIconForLink: {
// 		width: 50,
// 		height: 50,
// 		borderRadius: 25,
// 		backgroundColor: "transparent",
// 		borderColor: "transparent",
// 		borderWidth: 2,
// 		padding: 5,
// 		alignItems: "center",
// 		justifyContent: "center",
// 	},
// 	vwInputWithLabel: {
// 		backgroundColor: "white",
// 		padding: 5,
// 		flex: 1,
// 	},
// 	vwInputWithLabelForUnderline: {
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#806181",
// 	},
// 	txtInputInvite: {
// 		height: 40,
// 		padding: 5,
// 		color: "black",
// 	},
// 	btnGo: {
// 		justifyContent: "center",
// 		alignItems: "center",
// 		width: 50,
// 		height: 50,
// 		borderRadius: 25,
// 		backgroundColor: "#806181",
// 		borderColor: "#806181",
// 		borderWidth: 2,
// 		padding: 5,
// 	},
// 	txtBtnGo: {
// 		fontSize: 18,
// 		color: "white",
// 		fontWeight: "bold",
// 	},
// });

import React, { useEffect, useMemo } from "react";
import {
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	FlatList,
	Pressable,
	Alert,
} from "react-native";

import ScreenFrameWithTopChildren from "../../components/screen-frames/ScreenFrameWithTopChildren";
import Tribe from "../../assets/images/welcome/Tribe.svg";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../types/store";
import type { JoinPublicTeamScreenProps } from "../../types/navigation";
import {
	Team,
	updatePublicTeamsArray,
	updateTeamsArray,
} from "../../reducers/team";
import ButtonKvNoDefaultTextOnly from "../../components/buttons/ButtonKvNoDefaultTextOnly";

export default function JoinPublicTeam({
	navigation,
}: JoinPublicTeamScreenProps) {
	const userReducer = useSelector((state: RootState) => state.user);
	const teamReducer = useSelector((state: RootState) => state.team);
	const dispatch = useDispatch();

	const topChildren = (
		<View style={styles.vwTopChildren}>
			<Text style={styles.txtTopChildren}>
				Welcome {userReducer.user.username}
			</Text>
		</View>
	);

	useEffect(() => {
		fetchPublicTeams();
	}, []);

	const fetchPublicTeams = async () => {
		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/teams/public`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userReducer.token}`,
					},
				}
			);

			const contentType = response.headers.get("content-type") ?? "";
			const resJson = contentType.includes("application/json")
				? await response.json()
				: null;

			if (!response.ok) {
				const errorMessage =
					resJson?.error ||
					`There was a server error: ${response.status} ${response.statusText}`;
				Alert.alert("Error", errorMessage);
				dispatch(updatePublicTeamsArray([]));
				return;
			}

			const rawArray = Array.isArray(resJson?.publicTeamsArray)
				? resJson.publicTeamsArray
				: [];

			// Normalize to Team shape + ensure `selected` exists
			const normalizedAll: Team[] = rawArray.map(
				(t: any): Team => ({
					id: Number(t.id),
					teamName: String(t.teamName ?? ""),
					city: String(t.city ?? ""),
					coachName: String(t.coachName ?? ""),
					practiceMatch: t.practiceMatch ?? null,
					selected: false,
					genericJoinToken: t.genericJoinToken ?? undefined,
					visibility: t.visibility ?? undefined,
					description: t.description ?? undefined,
				})
			);

			// Filter out teams the user already belongs to
			const existingIds = new Set(teamReducer.teamsArray.map((t) => t.id));
			const remaining = normalizedAll.filter((t) => !existingIds.has(t.id));

			dispatch(updatePublicTeamsArray(remaining));
		} catch (error) {
			console.error("Fetch teams error:", error);
			Alert.alert("Error", "Network error. Please try again.");
			dispatch(updatePublicTeamsArray([]));
		}
	};

	// --- Selection helpers (single-select toggle using reducer state) ---
	const publicTeams = teamReducer.publicTeamsArray ?? [];
	const selectedTeam: Team | null = useMemo(
		() => publicTeams.find((t) => t.selected) ?? null,
		[publicTeams]
	);

	const onToggleTeam = (teamId: number) => {
		const alreadySelected = publicTeams.find((t) => t.id === teamId)?.selected;
		const next = publicTeams.map((t) => ({
			...t,
			// if tapping the same selected row again, deselect all; otherwise select only this row
			selected: alreadySelected ? false : t.id === teamId,
		}));
		dispatch(updatePublicTeamsArray(next));
	};

	// --- Join team flow ---
	const handleRequestJoinTeam = async () => {
		if (!selectedTeam) return; // Guard (button should be disabled anyway)

		try {
			const response = await fetch(
				`${process.env.EXPO_PUBLIC_API_BASE_URL}/contract-team-users/add-squad-member`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userReducer.token}`,
					},
					body: JSON.stringify({
						teamId: selectedTeam.id,
						email: userReducer.user.email,
					}),
				}
			);

			const contentType = response.headers.get("content-type") ?? "";
			const resJson = contentType.includes("application/json")
				? await response.json()
				: null;

			if (!response.ok) {
				const message =
					resJson?.error ||
					resJson?.message ||
					`Join failed: ${response.status}`;
				Alert.alert("Join failed", message);
				return;
			}

			// Success: add selected team to teamsArray (if not present)
			const existingIds = new Set(teamReducer.teamsArray.map((t) => t.id));
			const nextTeamsArray = existingIds.has(selectedTeam.id)
				? teamReducer.teamsArray
				: [...teamReducer.teamsArray, { ...selectedTeam, selected: false }];

			dispatch(updateTeamsArray(nextTeamsArray));

			// Remove the joined team from publicTeams and clear selection flags
			const nextPublic = publicTeams
				.filter((t) => t.id !== selectedTeam.id)
				.map((t) => ({ ...t, selected: false }));

			dispatch(updatePublicTeamsArray(nextPublic));

			Alert.alert("Success", "You have joined the team.");
		} catch (error) {
			console.error("Join team error:", error);
			Alert.alert("Error", "Network error. Please try again.");
		}
	};

	const selectTeamRow = ({ item }: { item: Team }) => {
		const isSelected = !!item.selected;

		return (
			<Pressable
				onPress={() => onToggleTeam(item.id)}
				style={[styles.vwTeamRow, isSelected && styles.vwTeamRowSelected]}
			>
				<Text style={styles.txtTeamName}>{item.teamName}</Text>
			</Pressable>
		);
	};

	return (
		<ScreenFrameWithTopChildren
			navigation={navigation}
			topChildren={topChildren}
		>
			<View style={styles.container}>
				<View style={styles.containerTop}>
					<Tribe width={80} height={80} />
					{Array.isArray(publicTeams) && publicTeams.length > 0 ? (
						<FlatList
							data={publicTeams}
							renderItem={selectTeamRow}
							keyExtractor={(item) => item.id.toString()}
							style={styles.flatListTeamNames}
						/>
					) : (
						<View style={styles.vwNoTeamInfo}>
							<Text style={styles.txtNoTeamInfo}>
								There are no public teams to join
							</Text>
							<Text style={styles.txtNoTeamInfo}>
								You can create your own team
							</Text>
						</View>
					)}
				</View>

				<View style={styles.containerBottom}>
					<View style={styles.vwInputGroup}>
						<ButtonKvNoDefaultTextOnly
							onPress={handleRequestJoinTeam}
							styleView={styles.btnTribe}
							styleText={styles.btnTribeText}
							active={!!selectedTeam} // <-- enabled only when a team is selected
						>
							Join Team
						</ButtonKvNoDefaultTextOnly>
					</View>
				</View>
			</View>
		</ScreenFrameWithTopChildren>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFDFD",
		width: "100%",
	},
	vwTopChildren: {
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	txtTopChildren: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	// Top
	containerTop: {
		alignItems: "center",
		paddingHorizontal: 10,
		flex: 1,
		height: "100%",
	},
	vwInputGroup: {
		width: "90%",
		alignItems: "center",
		paddingTop: 10,
	},
	// FlatList
	flatListTeamNames: {
		width: "100%",
		borderColor: "gray",
		borderWidth: 1,
		borderStyle: "solid",
		borderRadius: 10,
		padding: 5,
		minHeight: 100,
	},
	vwTeamRow: {
		padding: 15,
		marginVertical: 5,
		backgroundColor: "#F0F0F0",
		borderRadius: 5,
		width: "100%",
	},
	vwTeamRowSelected: {
		backgroundColor: "#D3D3D3",
	},
	txtTeamName: {
		fontSize: 16,
		textAlign: "center",
		fontWeight: "500",
	},
	vwNoTeamInfo: {
		alignItems: "center",
		width: "70%",
		gap: 20,
		marginTop: 20,
	},
	txtNoTeamInfo: {
		fontSize: 16,
		color: "#806181",
		textAlign: "center",
	},
	// Bottom
	containerBottom: {
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: Dimensions.get("window").height * 0.075,
	},
	btnTribe: {
		width: Dimensions.get("window").width * 0.6,
		height: 50,
		justifyContent: "center",
		backgroundColor: "#C0A9C0",
		borderRadius: 35,
		alignItems: "center",
	},
	btnTribeText: {
		color: "white",
		fontSize: 18,
	},
});
