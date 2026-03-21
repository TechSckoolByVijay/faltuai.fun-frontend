# Terraform Best Practices

Terraform remains stable and maintainable when modules, state, and reviews are standardized.

## Core practices

- Keep modules small and reusable
- Use remote state with locking enabled
- Validate and lint in CI

## Example module input

```hcl
module "network" {
  source      = "./modules/network"
  environment = "prod"
  cidr_block  = "10.40.0.0/16"
}
```

## Diagram

![Terraform Delivery Flow](/blog/blogs/images/terraform-best-practices_01.svg)

### Final thought

Consistency beats complexity.
