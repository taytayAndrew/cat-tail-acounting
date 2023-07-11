import useSWR from 'swr'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import p from '../assets/images/pig.svg'
import { useTitle } from '../hooks/useTitle'
import { Loading } from '../components/Loading'
import { AddItemFloatButton } from '../components/AddItemFloatButton'
import { useAjax } from '../lib/ajax'
import { AxiosError } from 'axios'
import { Icon } from '../components/Icon'
interface Props {
  title?: string
}


//不要使用默认header来设置 authorazation
export const Home: React.FC<Props> = (props) => {

  const {get} = useAjax({ showLoading: true, handleError: false })
  const nav = useNavigate()
  const onHttpError = (error: AxiosError) => {
    //返回状态码403就跳转
    if(error.response){
      if(error.response?.status === 403) {//根据请求给的状态码跳转页面
      nav('/sign_in')
    }
    }
    throw(error)
  }
  useTitle(props.title)
  const { data: meData, error: meError } = useSWR('/api/v1/me', async path =>
  {
   const response = await get<Resource<User>>(path).catch(onHttpError)
   return response.data.resource}
  )
  const { data: itemsData, error: itemsError } = useSWR(meData ? '/api/v1/items' : null, async path =>
    (await get<Resources<Item>>(path)).data
  )

  const isLoadingMe = !meData && !meError
  const isLoadingItems = meData && !itemsData && !itemsError

  if (isLoadingMe || isLoadingItems) {
    return <Loading className="h-screen" />
  }

  if (itemsData?.resources[0]) {
    return <Navigate to="/items" />
  }

  return <div>
    <div flex justify-center items-center>
      <Icon className='mt-20vh mb-20vh w-128px h-128px' name='pig'/>
    </div>
    <div px-16px>
      <Link to="/items/new">
       <button q-btn
      >开始记账</button>
      </Link>
     
    </div>
    <AddItemFloatButton />
  </div >
}
