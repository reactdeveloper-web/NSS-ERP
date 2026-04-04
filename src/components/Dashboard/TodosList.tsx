import React, { useEffect } from 'react';
import { Menu, Grid } from 'antd';
import { NavLink } from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';
import { logout } from 'src/components/Auth/Auth.thunks';
import { connect, ConnectedProps } from 'react-redux';
import { PATH } from 'src/constants/paths';
import { getTodos, clearProduct } from './Todos.thunks';
import { Link, useHistory } from 'react-router-dom';

const mapStateToProps = (state: AppState) => ({
    //loading: state.products.loading,
    todos: state.todos.todo,
});

const mapDispatchToProps = {
  getTodos,
  clearProduct,
};

const connector = connect(mapStateToProps, mapDispatchToProps);
interface Props extends ConnectedProps<typeof connector> {}

export const _TodosList = (props: Props) => {
  const history = useHistory();
//console.log('listview',todos);
  const { todos, getTodos, clearProduct } = props;


  //let data = [{}];
  useEffect(() => {
    getTodos();
  }, [getTodos]);
console.log('props222222',props.todos);
  // eslint-disable-next-line array-callback-return
  console.log('todos',todos);
  
  return (                       <div className="card card-xl-stretch mb-xl-8">
														{/* <!--begin::Header--> */}
														<div className="card-header border-0">
															<h3 className="card-title fw-bolder text-dark">Todo</h3>
														</div>
														{/* <!--End::Header--> */}

														{/* <!--begin::Body--> */}
														<div className="card-body pt-2" data-count="{todos.length}">

                                                           {todos?.length > 0 ? (
                                                                todos.map((todo, index) => (
                                                                    <div key={index} className="d-flex align-items-center mb-8">
                                                                    {/* begin::Item */}
                                                                    <div
                                                                        key={index}
                                                                        className={
                                                                          index === 0
                                                                            ? "bullet bullet-vertical h-40px bg-success"
                                                                            : index % 2 === 0
                                                                            ? "bullet bullet-vertical h-40px bg-primary"
                                                                            : "bullet bullet-vertical h-40px bg-warning"
                                                                        }>
                                                                    </div>
                                                                    <div className="flex-grow-1 ms-5">
                                                                        <div className="fw-bold text-gray-800">
                                                                        {todo.Panel}
                                                                        </div>
                                                                        <div className="text-muted">
                                                                        {todo.Description}
                                                                        </div>
                                                                    </div>
                                                                    <span
                                                                        key={index}
                                                                        className={
                                                                          index === 0
                                                                            ? "badge badge-light-success fs-8 fw-bolder"
                                                                            : index % 2 === 0
                                                                            ? "badge badge-light-primary fs-8 fw-bolder"
                                                                            : "badge badge-light-warning fs-8 fw-bolder"
                                                                        }>
                                                                          {todo.RecordCount}
                                                                    </span>
                                                                 

                                                                    {/* end::Item */}
                                                                    </div>
                                                                ))
                                                                ) : (
                                                                <div>No Data Found</div>
                                                                )}
                                                            
                                                        
														</div>
														{/* <!--end::Body--> */}
													</div>
                                   
  
  );
};

export const TodosList = connector(_TodosList);