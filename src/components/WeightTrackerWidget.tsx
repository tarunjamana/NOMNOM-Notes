import { useAppSelector } from "../store/hooks";
import * as Yup from "yup";
import { EditableSection } from "./EditableSection";
import {
  useLogWeightMutation,
  useGetWeightEntriesQuery,
} from "../store/services/weightTrackerApi";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const WeightTrackerWidget = () => {
  const userProfile = useAppSelector((store) => store.userProfile);
  const uid = userProfile.profile?.uid;

  const { data: entries = [], refetch } = useGetWeightEntriesQuery(uid!, {
    skip: !uid,
  });

  // const { data: profile } = useGetUserProfileQuery(uid!, {
  //   skip: !uid,
  // });

  const [logWeight] = useLogWeightMutation();

  const weightData = useMemo(() => {
    const profile = userProfile.profile;
    if (!profile?.createdAt || !profile.currentWeight) return [];

    const initial = {
      date: new Date(profile.createdAt),
      weight: Number(profile.currentWeight),
    };

    const entryPoints = entries.map((entry) => {
      let date: Date;

      if (
        typeof entry.loggedAt === "object" &&
        entry.loggedAt !== null &&
        typeof (entry.loggedAt as { toDate?: unknown }).toDate === "function"
      ) {
        date = (entry.loggedAt as { toDate: () => Date }).toDate();
      } else {
        date = new Date(entry.loggedAt);
      }

      return {
        date,
        weight: Number(entry.weight),
      };
    });

    return [initial, ...entryPoints].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }, [userProfile, entries]);

  if (!userProfile.profile) {
    return <div>Loading...</div>; // or some other loading/empty state
  }
  const { currentWeight } = userProfile.profile;

  type WeightMetrics = {
    weight: string;
  };

  const weightSchema = Yup.object().shape({
    weight: Yup.string()
      .test("is-number", "Must be a valid number", (value) => {
        if (!value) return false;
        return !isNaN(Number(value));
      })
      .test("is-positive", "Must be positive", (value) => {
        if (!value) return false;
        return Number(value) > 0;
      })
      .required("Required"),
  }) as Yup.ObjectSchema<WeightMetrics>;

  const weightMetricsIntitialValues = {
    weight: currentWeight,
  };

  const weightMetricsEditableConfig = {
    weight: true,
  };

  let displayedCurrentWeight: string = currentWeight?.toString() ?? "—";
  let displayedLastWeight: string = "—";

  if (entries.length === 1) {
    displayedCurrentWeight = entries[0].weight.toString();
    displayedLastWeight = currentWeight?.toString() ?? "—";
  } else if (entries.length >= 2) {
    displayedCurrentWeight = entries[0].weight.toString();
    displayedLastWeight = entries[1].weight.toString();
  }

  return (
    <div className="flex max-w-[300px] min-h-[250px] bg-white justify-between h-full flex-col border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Weight Tracker</h3>
      </div>
      {/* Placeholder for the weight graph  */}
      <div className="w-full h-28">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightData}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone" // smooth curve
              dataKey="weight"
              stroke="#CBD5E1" // Tailwind's slate-300 for soft blue/gray
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Amount and button section */}
      <div className="flex relative justify-between items-baseline">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900">
            {displayedCurrentWeight}
          </h3>
          <h3 className="text-sm font-medium text-gray-500">
            Last: {displayedLastWeight}kgs{" "}
          </h3>
        </div>
        <EditableSection<WeightMetrics>
          title="weight Information"
          fields={[{ name: "weight", label: "weight" }]}
          initialValues={weightMetricsIntitialValues}
          validationSchema={weightSchema}
          editableConfig={weightMetricsEditableConfig}
          onSave={async (values) => {
            if (!uid) return;
            await logWeight({ uid, weight: parseFloat(values.weight) });
            await refetch();
          }}
          editButtonText="Log Weight"
        />
      </div>
    </div>
  );
};

export default WeightTrackerWidget;
