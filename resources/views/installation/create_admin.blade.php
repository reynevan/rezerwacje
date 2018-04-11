@extends('installation.installation')
@section('content')

    @if ($errors->any())

        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {!! Form::open(['action' => 'InstallationController@saveAdmin']) !!}
    <div>
        {!! Form::label(trans('validation.attributes.first_name')) !!}
        {!! Form::text('first_name'); !!}
    </div>
    <div>
        {!! Form::label(trans('validation.attributes.last_name')) !!}
        {!! Form::text('last_name'); !!}
    </div>
    <div>
        {!! Form::label(trans('validation.attributes.email')) !!}
        {!! Form::text('email'); !!}
    </div>
    <div>
        {!! Form::label(trans('validation.attributes.password')) !!}
        {!! Form::password('password'); !!}
    </div>
    <div>
        {!! Form::label(trans('validation.attributes.password_repeat')) !!}
        {!! Form::password('password_repeat'); !!}
    </div>
    {!! Form::submit('Dalej'); !!}
    {!! Form::close() !!}
@endsection