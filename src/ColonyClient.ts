import {
  ColonyRole,
  getBlockTime,
  getColonyNetworkClient,
  getLogs,
  Network,
} from "@colony/colony-js";
import { utils, Wallet } from "ethers";
import { InfuraProvider } from "ethers/providers";
import moment from "moment";

// export type ColonyInitialisedEventData = {
//   primary: string;
//   secondary: string;
//   date: number;
//   eventType: string;
// };

export type allEventsType = {
  primary: {
    message?: string;
    userAddress?: string;
    amount?: string;
    token?: string;
    domainId?: string;
    fundingPotId?: string;
    role?: string;
  };
  secondary: string;
  date: number;
  eventType: string;
};

export async function retrieveData() {
  //Initialise the events object
  let allEvents: allEventsType[] = [];
  // Set up the network address constants that you'll be using
  // The two below represent the current ones on mainnet
  // Don't worry too much about them, just use them as-is
  const MAINNET_NETWORK_ADDRESS = `0x5346D0f80e2816FaD329F2c140c870ffc3c3E2Ef`;
  const MAINNET_BETACOLONY_ADDRESS = `0x869814034d96544f3C62DE2aC22448ed79Ac8e70`;

  // Get a new Infura provider (don't worry too much about this)
  const provider = new InfuraProvider();

  // Get a random wallet
  // You don't really need control over it, since you won't be firing any trasactions out of it
  const wallet = Wallet.createRandom();
  // Connect your wallet to the provider
  const connectedWallet = wallet.connect(provider);

  // Get a network client instance

  const networkClient = await getColonyNetworkClient(
    Network.Mainnet,
    connectedWallet,
    {
      networkAddress: MAINNET_NETWORK_ADDRESS,
    }
  );

  // Get the colony client instance for the betacolony
  const colonyClient = await networkClient.getColonyClient(
    MAINNET_BETACOLONY_ADDRESS
  );
  /***
   * Get initilisation data
   *
   */

  //Filter data
  const initialisationEventFilter = colonyClient.filters.ColonyInitialised(
    null,
    null
  );

  //Get data
  const initialisationEventLogs = await getLogs(
    colonyClient,
    initialisationEventFilter
  );

  //Get date
  const [rawLog] = initialisationEventLogs;
  // Use the blockHash to look up the actual time of the block that mined the transactions of the current event
  let logTime = undefined;
  if (rawLog.blockHash) {
    logTime = await getBlockTime(provider, rawLog.blockHash);
    if (logTime)
      allEvents.push({
        primary: {
          message: "Congratulations! It's a beautiful baby colony!",
        },
        secondary: moment(logTime).format("D MMM"),
        date: logTime,
        eventType: "ColonyInitialised",
      });
  }

  /***
   *
   * Get ColonyRoleSet data
   */

  const colonyRoleSetEventFilter = (
    colonyClient.filters as any
  ).ColonyRoleSet();

  //Get data
  const colonyRoleSeEventLogs = await getLogs(
    colonyClient,
    colonyRoleSetEventFilter
  );
  //Get date from raw data, parse it and extract data
  for (const rawLog of colonyRoleSeEventLogs) {
    const parsedLog = colonyClient.interface.parseLog(rawLog);
    const values = parsedLog.values;
    const role = ColonyRole[values.role];
    const domainId = new utils.BigNumber(values.domainId).toString();
    const userAddress = values.user;
    //console.log(role, domainId, user);
    let logTime = undefined;
    if (rawLog.blockHash) {
      logTime = await getBlockTime(provider, rawLog.blockHash);
      if (logTime) {
        allEvents.push({
          primary: {
            role: role,
            userAddress: userAddress,
            domainId: domainId,
          },
          secondary: moment(logTime).format("D MMM"),
          date: logTime,
          eventType: "ColonyRoleSet",
        });
      }
    }
  }

  /**
   * Get PayoutClaimed data
   *
   */
  //Filter data
  const payoutClaimedEventFilter = colonyClient.filters.PayoutClaimed(
    null,
    null,
    null
  );

  //Get data
  const payoutClaimedEventLogs = await getLogs(
    colonyClient,
    payoutClaimedEventFilter
  );
  //Parse data

  for (const rawLog of payoutClaimedEventLogs) {
    //console.log(rawLog)
    const parsedLog = colonyClient.interface.parseLog(rawLog);
    const values = parsedLog.values;
    // Payout Claimed
    //${userAddress}  ${amount}${token} ${fundingPotId}

    //user adress
    const humanReadableFundingPotId = new utils.BigNumber(
      values.fundingPotId
    ).toString();

    const { associatedTypeId } = await colonyClient.getFundingPot(
      humanReadableFundingPotId
    );

    const { recipient: userAddress } = await colonyClient.getPayment(
      associatedTypeId
    );

    const amount = new utils.BigNumber(values.amount).toString();
    const token = values.token;
    const fundingPotId = new utils.BigNumber(values.fundingPotId).toString();

    let logTime = undefined;
    if (rawLog.blockHash) {
      logTime = await getBlockTime(provider, rawLog.blockHash);
      if (logTime) {
        allEvents.push({
          primary: {
            userAddress: userAddress,
            amount: amount,
            token: token,
            fundingPotId: fundingPotId,
          },
          secondary: moment(logTime).format("D MMM"),
          date: logTime,
          eventType: "PayoutClaimed",
        });
      }
    }
  }

  /***
   * Get DomainAdded data
   */
  const domainAddedEventFilter = colonyClient.filters.DomainAdded(null);

  //Get data
  const domainAddedEventLogs = await getLogs(
    colonyClient,
    domainAddedEventFilter
  );

  //Parse data

  for (const rawLog of domainAddedEventLogs) {
    const parsedLog = colonyClient.interface.parseLog(rawLog);
    const values = parsedLog.values;
    const domainId = new utils.BigNumber(values.domainId).toString();
    let logTime = undefined;
    if (rawLog.blockHash) {
      logTime = await getBlockTime(provider, rawLog.blockHash);
      if (logTime) {
        allEvents.push({
          primary: { domainId: domainId },
          secondary: moment(logTime).format("D MMM"),
          date: logTime,
          eventType: "DomainAdded",
        });
      }
    }
  }

  allEvents.sort(function (a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  return allEvents;
}

export function dataRequested() {
  return new Promise(function (resolve, reject) {
    try {
      const allEvents = retrieveData();
      resolve(allEvents);
    } catch (error) {
      reject(error);
    }
  });
}
