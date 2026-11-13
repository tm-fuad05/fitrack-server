export function validateRequest(schema) {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      });

      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;
      if (parsed.file) req.params = parsed.file;

      next();
    } catch (error) {
      if (error) {
        console.log(
          "Validation Error:",
          error?.issues?.map((err) => ({
            field: err?.path[1],
            message: err?.message,
          })),
        );
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error?.issues?.map((err) => ({
            field: err?.path[1],
            message: err?.message,
          })),
        });
      }
      next(error);
    }
  };
}
