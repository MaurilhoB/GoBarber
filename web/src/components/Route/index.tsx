import React from 'react';
import {
  RouteProps as RDRouteProps,
  Route as RDRoute,
  Redirect
} from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
interface RouteProps extends RDRouteProps  {
  isPrivate?: boolean
  component: React.ComponentType
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {

  const { user } = useAuth()
  return (
    <RDRoute
      {...rest}
      render={() => (
        isPrivate === !!user ?
        <Component /> :
        <Redirect to={{pathname: isPrivate ? '/' : 'dashboard'}}/>
      )}
    />
  )
}
export default Route
