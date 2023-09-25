export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const isVideoPresent = (services: ServiceType[]) => services.includes("VideoRecording");
const isVideoOrPhotographyPresent = (services: ServiceType[]) => services.includes("VideoRecording") || services.includes("Photography");

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    switch (action.type) {
        case "Select":
            if (action.service === "BlurayPackage" && !isVideoPresent(previouslySelectedServices)) return previouslySelectedServices;
            if (action.service === "TwoDayEvent" && !isVideoOrPhotographyPresent(previouslySelectedServices)) return previouslySelectedServices;
            previouslySelectedServices.push(action.service);
            return [...new Set<ServiceType>(previouslySelectedServices)];
        case "Deselect":
            let filteredServices = previouslySelectedServices.filter(x => x !== action.service);
            if (!isVideoPresent(filteredServices)) filteredServices = filteredServices.filter(x => x !== "BlurayPackage");
            if (!isVideoOrPhotographyPresent(filteredServices)) filteredServices = filteredServices.filter(x => x !== "TwoDayEvent");
            return filteredServices;
    }
};

const getPriceForVideoAndPhotoPackage = (year: number) => year === 2020 ? 2200 : year === 2021 ? 2300 : year === 2022 ? 2500 : 0;
const getPriceForVideoRecording = (year: number) => year === 2020 ? 1700 : year === 2021 ? 1800 : year === 2022 ? 1900 : 0;
const getPriceForPhotography = (year: number) => year === 2020 ? 1700 : year === 2021 ? 1800 : year === 2022 ? 1900 : 0;

const getWeddingSessionDiscount = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let discount = 0;
    if (selectedServices.includes("Photography") && selectedYear === 2022) discount = 600;
    if (isVideoOrPhotographyPresent(selectedServices) && discount < 300) discount = 300;
    return discount;
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let discount = 0;

    if (selectedServices.includes("Photography") && selectedServices.includes("VideoRecording")) {
        basePrice = getPriceForVideoAndPhotoPackage(selectedYear);
    } else if (selectedServices.includes("Photography")) {
        basePrice = getPriceForPhotography(selectedYear);
    } else if (selectedServices.includes("VideoRecording")) {
        basePrice = getPriceForVideoRecording(selectedYear);
    }

    if (selectedServices.includes("BlurayPackage") && isVideoPresent(selectedServices)) basePrice += 300;
    if (selectedServices.includes("TwoDayEvent") && isVideoOrPhotographyPresent(selectedServices)) basePrice += 400;
    if (selectedServices.includes("WeddingSession")) {
        basePrice += 600;
        discount += getWeddingSessionDiscount(selectedServices, selectedYear);
    }

    return ({ basePrice, finalPrice: basePrice - discount })
};