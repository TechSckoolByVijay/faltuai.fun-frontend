# Kubernetes Scaling Patterns

Scaling in Kubernetes is more than CPU triggers. Good scaling combines metrics, limits, and architecture.

## Recommended patterns

- Horizontal Pod Autoscaler for stateless workloads
- Cluster autoscaler for node pressure
- Resource requests and limits tuned by real usage

## Example HPA

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  minReplicas: 2
  maxReplicas: 10
```

![Kubernetes Scaling Patterns](/blog/blogs/images/kubernetes-scaling-patterns_01.svg)
