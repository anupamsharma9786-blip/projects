import React from 'react'
import FaceExpressionDetector from './features/expression/components/FaceExpression'
import { AppRoute } from './app.routes'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/auth/auth.context'
import { SongProvider } from './features/home/song.context'

const App = () => {
  return(
    <SongProvider>
      <AuthProvider>
        <RouterProvider router={AppRoute} />
      </AuthProvider>
    </SongProvider>
  )
}
export default App
