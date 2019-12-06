const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();
const engineApi = axios.create({
  baseURL: `${process.env.ENGINE_URL}/api/v1`
});

// Health

router.get("/health", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/health");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Metric Names
router.get("/metric_names", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/metric_names");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Agents
router.get("/agents", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/agents");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Clusters
router.get("/clusters", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/clusters");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/clusters/:clusterId/nodes", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/clusters/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/clusters/:clusterId/agent", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/clusters/${req.params.clusterId}/agents`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Incidents
router.get("/incidents/basic", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/incidents/basic");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Nodes
router.get("/nodes", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get("/nodes");
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Snapshot
router.get("/snapshot/:clusterId/nodes", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/snapshot/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/snapshot/:clusterId/nodes/:nodeId", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/processes",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/processes`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/processes/:processId",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/processes/${req.params.processId}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/containers",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/containers`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/nodes/:nodeId/containers/:containersId",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/nodes/${req.params.nodeId}/containers/${req.params.containersId}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get("/snapshot/:clusterId/k8s/pods", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/snapshot/${req.params.clusterId}/k8s/pods`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get(
  "/snapshot/:clusterId/k8s/namespaces/:namespaceId/pods",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/k8s/namespaces/${req.params.namespaceId}/pods`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/snapshot/:clusterId/k8s/namespaces/:namespaceId/pods/:podId",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/snapshot/${req.params.clusterId}/k8s/namespaces/${req.params.namespaceId}/pods/${req.params.podId}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// Status
router.get("/status", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(`/status`);
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Summary
router.get("/summary/clusters", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(`/summary/clusters`);
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId/nodes", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/summary/clusters/:clusterId/nodes", async (req, res, next) => {
  try {
    const { data: result } = await engineApi.get(
      `/summary/clusters/${req.params.clusterId}/nodes`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get(
  "/summary/clusters/:clusterId/nodes/:nodeId",
  async (req, res, next) => {
    try {
      const { data: result } = await engineApi.get(
        `/summary/clusters/${req.params.clusterId}/nodes/${req.params.nodeId}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

// Metrics

router.get("/metrics/:clusterId/nodes", async (req, res, next) => {
  try {
    let dataRangeText = "";
    let metricNamesText = "";
    req.query.dateRange.map(
      item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
    );
    req.query.metricNames.map(
      item =>
        (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
    );
    const { data: result } = await engineApi.get(
      `/metrics/${req.params.clusterId}/nodes?${dataRangeText +
        metricNamesText}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/metrics/:clusterId/nodes/:nodeId", async (req, res, next) => {
  try {
    let dataRangeText = "";
    let metricNamesText = "";
    req.query.dateRange.map(
      item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
    );
    req.query.metricNames.map(
      item =>
        (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
    );
    const { data: result } = await engineApi.get(
      `/metrics/${req.params.clusterId}/nodes/${
        req.params.nodeId
      }?${dataRangeText + metricNamesText}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get(
  "/metrics/:clusterId/nodes/:nodeId/processes",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/nodes/${
          req.params.nodeId
        }/processes?${dataRangeText + metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/metrics/:clusterId/nodes/:nodeId/processes/:processId",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/nodes/${
          req.params.nodeId
        }/processes/${req.params.processId}?${dataRangeText + metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/metrics/:clusterId/nodes/:nodeId/containers",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/nodes/${
          req.params.nodeId
        }/containers?${dataRangeText + metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/metrics/:clusterId/nodes/:nodeId/containers/:containerId",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/nodes/${
          req.params.nodeId
        }/containers/${req.params.containerId}?${dataRangeText +
          metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get("/metrics/:clusterId/k8s/pods", async (req, res, next) => {
  try {
    let dataRangeText = "";
    let metricNamesText = "";
    req.query.dateRange.map(
      item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
    );
    req.query.metricNames.map(
      item =>
        (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
    );
    const { data: result } = await engineApi.get(
      `/metrics/${req.params.clusterId}/k8s/pods?${dataRangeText +
        metricNamesText}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get(
  "/metrics/:clusterId/k8s/namespaces/:namespaceId/pods",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/k8s/namespaces/${
          req.params.namespaceId
        }/pods?${dataRangeText + metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/metrics/:clusterId/k8s/namespaces/:namespaceId/pods/:podId",
  async (req, res, next) => {
    try {
      let dataRangeText = "";
      let metricNamesText = "";
      req.query.dateRange.map(
        item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
      );
      req.query.metricNames.map(
        item =>
          (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
      );
      const { data: result } = await engineApi.get(
        `/metrics/${req.params.clusterId}/k8s/namespaces/${
          req.params.namespaceId
        }/pods/${req.params.podId}?${dataRangeText + metricNamesText}`
      );
      res.json(result);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get("/metrics/:clusterId/summary", async (req, res, next) => {
  try {
    let dataRangeText = "";
    let metricNamesText = "";
    req.query.dateRange.map(
      item => (dataRangeText = dataRangeText.concat("&", `dateRange=${item}`))
    );
    req.query.metricNames.map(
      item =>
        (metricNamesText = metricNamesText.concat("&", `metricNames=${item}`))
    );
    const { data: result } = await engineApi.get(
      `/metrics/${req.params.clusterId}/summary?${dataRangeText +
        metricNamesText}`
    );
    res.json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
