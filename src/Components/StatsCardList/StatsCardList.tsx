
import StatsCard from '../StatsCard/StatsCard';
import stats from "./stats.json";

const StatsCardList: React.FC = () => {
    return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        changeDescription={stat.changeDescription}
                    />
                ))}
            </div>
    );
};

export default StatsCardList;