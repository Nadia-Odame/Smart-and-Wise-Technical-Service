export const business = {
  name: "Smart and Wise Technical Service",
  shortName: "Smart & Wise",
  tagline: "Generator servicing, repairs and power solutions you can rely on.",
  phone: "+233 24 409 3842",
  phoneHref: "tel:+233244093842",
  whatsapp: "https://wa.me/233244093842",
  address: "Owulabu, Ghana",
  hours: "Open daily · Closes 8:00 pm",
  mapQuery: "HGXG%2B8J9%2C+Owulabu%2C+Ghana",
};

export interface ServiceItem {
  id: string;
  name: string;
  short: string;
  description: string;
  points: string[];
}

export const services: ServiceItem[] = [
  {
    id: "servicing",
    name: "Generator Servicing",
    short: "Routine maintenance that keeps your generator starting first time.",
    description:
      "Regular servicing is the simplest way to avoid a breakdown. We change the oil and filters, check the coolant and battery, clean the air intake, test the output and run the machine under load to be sure it performs when the lights go off.",
    points: [
      "Oil, oil filter, fuel filter and air filter change",
      "Battery, coolant and belt checks",
      "Load test and output reading",
      "Simple written report of what we found",
    ],
  },
  {
    id: "repairs",
    name: "Generator Repairs",
    short: "Fault finding and repairs for generators that won't start or run properly.",
    description:
      "If your generator won't start, cuts out, smokes or trips, we come and find the fault first, then explain the problem and the cost before any work begins. We handle starters, alternators, control panels, fuel systems, cooling and wiring.",
    points: [
      "On-site fault diagnosis",
      "Starter, alternator and control panel repairs",
      "Fuel system and injector work",
      "Cooling system and radiator repairs",
    ],
  },
  {
    id: "electrical",
    name: "Electrical Works",
    short: "Wiring, changeover switches and distribution boards done safely.",
    description:
      "We do the electrical work around your generator and your building: changeover switches, automatic transfer switches, distribution boards, cabling, earthing and general wiring for homes, shops and offices.",
    points: [
      "Manual and automatic changeover switches",
      "Distribution boards and breakers",
      "Cabling, earthing and socket circuits",
      "Fault tracing on existing installations",
    ],
  },
  {
    id: "overhauling",
    name: "Engine Overhauling",
    short: "Full engine rebuilds for tired or seized generator engines.",
    description:
      "When an engine has done long hours or has seized, an overhaul brings it back instead of buying a new set. We strip the engine, measure and machine what can be saved, replace worn parts, reassemble and test-run before handing it over.",
    points: [
      "Complete strip-down and inspection",
      "Piston, ring, liner and bearing replacement",
      "Head reconditioning and valve work",
      "Reassembly, timing and test run",
    ],
  },
];
