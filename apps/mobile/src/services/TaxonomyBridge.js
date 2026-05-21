export const TaxonomyBridge = {
  mapMetadata: (data) => ({ spatialNode: data.nodeId, taxonomy: data.type }),
  captureEvent: (node) => console.log('Capturing:', node)
};
