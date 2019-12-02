const express = require("express");
const axios = require("axios");
const router = express.Router();
const engineApi = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? `${process.env.ENGINE_DEV_URL}/api/v1`
      : `${process.env.ENGINE_PROD_URL}/api/v1`
});

//Agents
router.get("/agents", async (req, res, next) => {
  try {
    const result = await engineApi.get("/agents");
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Clusters
router.get("/clusters", async (req, res, next) => {
  try {
    const result = await engineApi.get("/clusters");
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/cluster/:clusterId/nodes", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/cluster/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/clusters/:clusterId/agent", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/clusters/${req.params.clusterId}/agents`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Incidents
router.get("/incidents/basic", async (req, res, next) => {
  try {
    const result = await engineApi.get("/incidents/basic");
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Nodes
router.get("/nodes", async (req, res, next) => {
  try {
    const result = await engineApi.get("/nodes");
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Snapshot
router.get("/snapshot/:clusterId/nodes", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/snapshot/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/snapshot/:clusterId/nodes/:nodeId", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/processes",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/processes`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/processes/:processId",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/processes/${req.params.processId}`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/containers",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/containers`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/containers/:containersId",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/containers/${req.params.containersId}`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get("/snapshot/:clusterId/k8s/pods", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/snapshot/${req.params.clusterId}/k8s/pods`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(
  "/snapshot/:clusterId/k8s/namespaces/:namespaceId/pods",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/k8s/namespaces/${req.params.namespaceId}/pods`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/k8s/namespaces/:namespaceId/pods/:podId",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/snapshot/${req.params.clusterId}/k8s/namespaces/${req.params.namespaceId}/pods/${req.params.podId}`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Status
router.get("/status", async (req, res, next) => {
  try {
    const result = await engineApi.get(`/status`);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//Summary
router.get("/summary/clusters", async (req, res, next) => {
  try {
    const result = await engineApi.get(`/summary/clusters`);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId/nodes", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId/nodes", async (req, res, next) => {
  try {
    const result = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get(
  "/summary/clusters/:clusterId/nodes/:nodeId",
  async (req, res, next) => {
    try {
      const result = await engineApi.get(
        `/summary/clusters/${req.params.clusterId}/nodes/${req.params.nodeId}`
      );
      res.json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// TO DO: add metrics

module.exports = router;
