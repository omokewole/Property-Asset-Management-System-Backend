import {
  createMaintenance,
  updateMaintenance,
  allMaintenances,
  deleteMaintenance,
  singleMaintenance,
} from "../services/maintenance.service.js";
import { responseModel } from "../utils/responseModel.js";

export async function handleCreateMaintenance(req, res) {
  try {
    const newMaintenanceInfo = req.body;
    const owner_id = req.user._id;

    const newMaintenanceData = await createMaintenance({
      ...newMaintenanceInfo,
      owner_id,
    });

    res
      .status(200)
      .json(
        responseModel(
          true,
          "Maintenance created successful!",
          newMaintenanceData
        )
      );
  } catch (error) {
    console.log(error);
    res
      .status(error.status || 500)
      .json(responseModel(false, error.message || "An error occured!"));
  }
}

export async function handleUpdateMaintenance(req, res) {
  try {
    const updatedMaintenanceInfo = req.body;
    const maintenanceId = req.params.maintenance_id;

    const updatedMaintenanceData = await updateMaintenance(
      updatedMaintenanceInfo,
      maintenanceId
    );

    res
      .status(200)
      .json(
        responseModel(
          true,
          "Maintenance updated successful!",
          updatedMaintenanceData
        )
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(responseModel(false, error.message || "An error occured!"));
  }
}

export async function handleAllMaintenance(req, res) {
  try {
    const owner_id = req.user._id;
    const { page, limit, order, sortBy } = req.query;

    const maintenances = await allMaintenances({
      owner_id,
      page,
      limit,
      order,
      sortBy,
    });

    res
      .status(200)
      .json(
        responseModel(true, "Maintenances fetched successfully", maintenances)
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(responseModel(false, error.message || "An error occured"));
  }
}

export async function handleSingleMaintenance(req, res) {
  try {
    const maintenanceId = req.params.maintenance_id;

    const maintenance = await singleMaintenance(maintenanceId);

    res
      .status(200)
      .json(
        responseModel(true, "Maintenance fetched successfully", maintenance)
      );
  } catch (error) {
    res
      .status(error.status || 500)
      .json(responseModel(false, error.message || "An error occured"));
  }
}

export async function handleDeleteMaintenance(req, res) {
  try {
    const maintenanceId = req.params.maintenance_id;

    const result = await deleteMaintenance(maintenanceId);

    res
      .status(200)
      .json(responseModel(true, "Maintenance deleted successfully", result));
  } catch (error) {
    res
      .status(error.status || 500)
      .json(responseModel(false, error.message || "An error occured"));
  }
}
