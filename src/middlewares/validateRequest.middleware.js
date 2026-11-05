export function validateRequest(schema) {
  return async function (req, res, next) {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.query) req.query = parsed.query;

      next();
    } catch (error) {
      console.log("Validation Error:", error);
      return res.status(500).json({
        success: false,
        errors: error?.issues?.map((err) => ({
          field: err?.path[0],
          message: err?.message,
        })),
      });
    }
  };
}
