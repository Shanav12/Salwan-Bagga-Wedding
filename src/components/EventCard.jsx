const EventCard = ({ time, name, location }) => (
  <div className="flex flex-col gap-1">
    <p className="font-prata text-[#691700] text-xl md:text-2xl">{name}</p>
    {time && (
      <p className="font-prata text-[#5a5a5a] text-sm md:text-base">{time}</p>
    )}
    {location && (
      <p className="font-prata text-[#5a5a5a] text-sm md:text-base">
        Location: {location}
      </p>
    )}
  </div>
);

export default EventCard;
