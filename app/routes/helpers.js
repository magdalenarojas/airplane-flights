const CATEGORY_ORDER = ["Normal", "Gold", "Platinum", "Black"];

export const getBoardedPassengers = (passengers, capacity) => {
  const reservationsInfo = passengers.reduce((acc, passenger) => {
    const { reservationId, category } = passenger;

    if (!acc[reservationId]) {
      acc[reservationId] = {
        passengers: [],
        maxCategory: category,
      };
    }

    acc[reservationId].passengers.push(passenger);

    const currentMaxCategory = acc[reservationId].maxCategory;
    if (
      CATEGORY_ORDER.indexOf(category) >
      CATEGORY_ORDER.indexOf(currentMaxCategory)
    ) {
      acc[reservationId].maxCategory = category;
    }
    return acc;
  }, {});

  const boardedPassengers = [];
};
